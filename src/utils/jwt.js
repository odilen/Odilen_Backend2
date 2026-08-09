import jwt from "jsonwebtoken"

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  }
  return jwt.sign(
        payload, //datos que se van a incluir en el token, en este caso el id, email y rol del usuario
        process.env.JWT_SECRET,//string secreta para firmar el token, se debe mantener en secreto y no compartir con nadie
        { expiresIn: process.env.JWT_EXPIRES_IN }//tiempo de expiracion del token, se puede establecer en segundos, minutos, horas o dias
    ) //crea un token con la informacion del usuario y lo firma con la clave secreta, ademas de establecer un tiempo de expiracion 
}