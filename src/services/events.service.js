import eventsRepository from '../repositories/events.repository.js'
import {
  ValidationError,
  ForbiddenError,
  NotFoundError
} from '../utils/errors.js'

class EventsService {
  async getAllEvents(query = {}) {
    const {
      status,
      category,
      location,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10,
      sort = 'date'
    } = query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1
    ) {
      throw new ValidationError(
        'page y limit deben ser números enteros mayores que 0'
      )
    }

    const filters = {}

    if (status) {
      filters.status = status
    }

    if (category) {
      filters.category = category
    }

    if (location) {
      filters.location = location
    }

    if (dateFrom || dateTo) {
      filters.date = {}

      if (dateFrom) {
        const from = new Date(dateFrom)

        if (Number.isNaN(from.getTime())) {
          throw new ValidationError('dateFrom no es una fecha válida')
        }

        filters.date.$gte = from
      }

      if (dateTo) {
        const to = new Date(dateTo)

        if (Number.isNaN(to.getTime())) {
          throw new ValidationError('dateTo no es una fecha válida')
        }

        filters.date.$lte = to
      }

      if (
        filters.date.$gte &&
        filters.date.$lte &&
        filters.date.$gte > filters.date.$lte
      ) {
        throw new ValidationError(
          'dateFrom no puede ser posterior a dateTo'
        )
      }
    }

    const allowedSortFields = [
      'date',
      'title',
      'price',
      'capacity',
      'createdAt'
    ]

    const descending = sort.startsWith('-')
    const sortField = descending ? sort.slice(1) : sort

    if (!allowedSortFields.includes(sortField)) {
      throw new ValidationError(
        'El campo de ordenamiento no es válido'
      )
    }

    const sortOption = {
      [sortField]: descending ? -1 : 1
    }

    const result = await eventsRepository.getAll(
      filters,
      pageNumber,
      limitNumber,
      sortOption
    )

    return {
      data: result.events,
      page: pageNumber,
      limit: limitNumber,
      total: result.total,
      totalPages: Math.ceil(result.total / limitNumber)
    }
  }

  async getEventById(id) {
    const event = await eventsRepository.getById(id)

    if (!event) {
      throw new NotFoundError('Evento no encontrado')
    }

    return event
  }

  async createEvent(payload, organizerId) {
    const {
      title,
      description,
      category,
      date,
      location,
      capacity,
      price,
      status = 'draft'
    } = payload || {}

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !location ||
      capacity === undefined ||
      price === undefined
    ) {
      throw new ValidationError(
        'Faltan campos obligatorios del evento'
      )
    }

    const eventDate = new Date(date)

    if (Number.isNaN(eventDate.getTime())) {
      throw new ValidationError('La fecha del evento no es válida')
    }

    if (eventDate <= new Date()) {
      throw new ValidationError(
        'No se puede crear un evento con fecha pasada'
      )
    }

    const capacityNumber = Number(capacity)
    const priceNumber = Number(price)

    if (
      !Number.isFinite(capacityNumber) ||
      capacityNumber <= 0
    ) {
      throw new ValidationError(
        'La capacidad debe ser mayor que 0'
      )
    }

    if (
      !Number.isFinite(priceNumber) ||
      priceNumber < 0
    ) {
      throw new ValidationError(
        'El precio debe ser mayor o igual que 0'
      )
    }

    const allowedStatuses = [
      'draft',
      'published',
      'cancelled',
      'finished'
    ]

    if (!allowedStatuses.includes(status)) {
      throw new ValidationError('El estado no es válido')
    }

    return await eventsRepository.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      date: eventDate,
      location: location.trim(),
      capacity: capacityNumber,
      price: priceNumber,
      status,
      organizer: organizerId
    })
  }

  async updateEvent(id, payload, user) {
    const event = await this.getEventById(id)

    this.validatePermission(event, user)

    if (event.status === 'cancelled') {
      throw new ValidationError(
        'Los eventos cancelados no pueden modificarse'
      )
    }

    const eventData = {}

    const textFields = [
      'title',
      'description',
      'category',
      'location'
    ]

    for (const field of textFields) {
      if (payload[field] !== undefined) {
        if (
          typeof payload[field] !== 'string' ||
          !payload[field].trim()
        ) {
          throw new ValidationError(
            `${field} no puede estar vacío`
          )
        }

        eventData[field] = payload[field].trim()
      }
    }

    if (payload.date !== undefined) {
      const eventDate = new Date(payload.date)

      if (Number.isNaN(eventDate.getTime())) {
        throw new ValidationError(
          'La fecha del evento no es válida'
        )
      }

      eventData.date = eventDate
    }

    if (payload.capacity !== undefined) {
      const capacity = Number(payload.capacity)

      if (!Number.isFinite(capacity) || capacity <= 0) {
        throw new ValidationError(
          'La capacidad debe ser mayor que 0'
        )
      }

      eventData.capacity = capacity
    }

    if (payload.price !== undefined) {
      const price = Number(payload.price)

      if (!Number.isFinite(price) || price < 0) {
        throw new ValidationError(
          'El precio debe ser mayor o igual que 0'
        )
      }

      eventData.price = price
    }

    return await eventsRepository.update(id, eventData)
  }

  async updateEventStatus(id, newStatus, user) {
    const event = await this.getEventById(id)

    this.validatePermission(event, user)

    const allowedStatuses = [
      'draft',
      'published',
      'cancelled',
      'finished'
    ]

    if (!allowedStatuses.includes(newStatus)) {
      throw new ValidationError('El estado no es válido')
    }

    if (event.status === 'cancelled') {
      throw new ValidationError(
        'No se puede cambiar el estado de un evento cancelado'
      )
    }

    if (
      newStatus === 'published' &&
      (
        event.status === 'finished' ||
        event.date < new Date()
      )
    ) {
      throw new ValidationError(
        'No se puede publicar un evento finalizado'
      )
    }

    return await eventsRepository.update(id, {
      status: newStatus
    })
  }

  validatePermission(event, user) {
    const isAdmin = user.role === 'admin'

    const isOwner =
      event.organizer.toString() === user.id.toString()

    if (!isAdmin && !isOwner) {
      throw new ForbiddenError(
        'Solo podés modificar tus propios eventos'
      )
    }
  }
}

export default new EventsService()