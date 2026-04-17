import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_recetas';

//peticiones con el ID del usuario logueado
export interface AuthRequest extends Request {
    usuario_id?: number;
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    //busca el token
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(403).json({ error: 'Acceso denegado. No se proporcionó un token.' });
        return;
    }

    //acorto para quedarme solo con el codigo
    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(403).json({ error: 'Formato de token inválido.' });
        return;
    }

    try {
        //verificacion de autenticidad del token
        const decodificado = jwt.verify(token, JWT_SECRET) as { userId: number };

        //si esta todo ok, pegamos el ID del usuario en la request para que la ruta de recetas sepa quien es
        req.usuario_id = decodificado.userId;

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};