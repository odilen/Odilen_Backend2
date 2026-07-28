import usersRepository from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';

class SessionsService {
    async register(data) {
        const payload = data || {};
        const first_name = payload.first_name || payload.username || payload.name || '';
        const last_name = payload.last_name || '';
        const email = payload.email;
        const role = payload.role || 'user';
        const password = payload.password;

        if (!first_name || !email || !password) {
            throw new Error('first_name, email y password son obligatorios');
        }

        if (!email.includes('@')) {
            throw new Error('El email debe tener un formato válido');
        }

        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        const existingUser = await usersRepository.getByEmail(email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        const hashedPassword = await createHash(password);

        const newUser = await usersRepository.create({
            first_name,
            last_name,
            email,
            role,
            password: hashedPassword
        });

        const userResponse = newUser.toObject ? newUser.toObject() : { ...newUser };
        delete userResponse.password;

        return userResponse;
    }
}

export default new SessionsService();