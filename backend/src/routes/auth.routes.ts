import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();
// Llave para firmar los inicios de sesión
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_recetas';

// RUTA DE REGISTRO
router.post('/registro', async (req, res): Promise<any> => {
    try {
        const { nombre, apellido, email, password } = req.body;

        //Verifica si el email ya existe
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        //Encripta la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Crea el usuario en la base de datos
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ mensaje: 'Usuario creado', usuario: { id: nuevoUsuario.id, email: nuevoUsuario.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// RUTA DE LOGIN
router.post('/login', async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body;

        //Busca al usuario
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        //Compara contraseñas
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        //Genera el token de sesión
        const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

export default router;