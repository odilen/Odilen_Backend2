export const authorizedRoles = (...roles) => {/*los ... significa que se puede pasar un número variable de argumentos */
  
return (req, res, next) => {

    if(!req.user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'User not authenticated'
       })
    }
    if(!roles.includes(req.user.role)){
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        })
    }
    next()
  }
}