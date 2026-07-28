import bcrypt from 'bcryptjs';

export const createHash = async (password) => {
    return await bcrypt.hash(
        password,
        10 // salt, es un valor aleatorio que se agrega a la contraseña antes de hashearla, para hacerla más segura
    );
};