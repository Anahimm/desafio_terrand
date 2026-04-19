import { Router, Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { verificarToken, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

//CREAR UNA RECETA
router.post('/crear', verificarToken, async (req: AuthRequest, res: Response) => {
    try {
        const { titulo, descripcion, ingredientes, imagen_url } = req.body;
        const usuario_id = req.usuario_id;

        if (!usuario_id) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        const nuevaReceta = await prisma.receta.create({
            data: {
                titulo,
                descripcion,
                ingredientes,
                imagen_url,
                usuario_id //Para enlazar con el usuario que crea la receta
            }
        });

        res.status(201).json(nuevaReceta);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al guardar la receta' });
    }
});

//OBTENER RECETAS PROPIAS
router.get('/mis-recetas', verificarToken, async (req: AuthRequest, res: Response) => {
    try {
        const usuario_id = req.usuario_id;

        const misRecetas = await prisma.receta.findMany({
            where: {
                usuario_id: usuario_id
            }
        });

        res.json(misRecetas);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al buscar las recetas' });
    }
});

//ACTUALIZAR UNA RECETA
router.put('/editar/:id', verificarToken, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, ingredientes, imagen_url } = req.body;
        const usuario_id = req.usuario_id;

        //se actualiza solo si es del usuario que inicio sesión
        const recetaActualizada = await prisma.receta.updateMany({
            where: {
                id: Number(id),
                usuario_id: usuario_id
            },
            data: {
                titulo,
                descripcion,
                ingredientes,
                imagen_url
            }
        });

        if (recetaActualizada.count === 0) {
            res.status(404).json({ error: 'Receta no encontrada o no tenés permiso' });
            return;
        }

        res.json({ mensaje: 'Receta actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la receta' });
    }
});

//ELIMINAR UNA RECETA
router.delete('/eliminar/:id', verificarToken, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario_id;

        const recetaEliminada = await prisma.receta.deleteMany({
            where: {
                id: Number(id),
                usuario_id: usuario_id
            }
        });
        if (recetaEliminada.count === 0) {
            res.status(404).json({ error: 'Receta no encontrada o no tenés permiso' });
            return;
        }

        res.json({ mensaje: 'Receta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la receta' });
    }
});

//OBTENER UNA RECETA PUBLICA
router.get('/publicas/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const receta = await prisma.receta.findUnique({
            where: {
                id: Number(id)
            },
            //solo mostrará nombre y apellido del autor
            include: {
                usuario: {
                    select: {
                        nombre: true,
                        apellido: true
                    }
                }
            }
        });

        if (!receta) {
            res.status(404).json({ error: 'La receta no existe o fue eliminada' });
            return;
        }

        res.json(receta);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al cargar la receta pública' });
    }
});

export default router;