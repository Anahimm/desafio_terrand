import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { 
    crearReceta, 
    obtenerMisRecetas, 
    editarReceta, 
    eliminarReceta, 
    obtenerRecetasPublicas, 
    obtenerUnaRecetaPublica,
    calificarReceta 
} from '../controllers/recetas.controller';

const router = Router();

// RUTAS PRIVADAS (Requieren estar logueado)
router.post('/crear', verificarToken, crearReceta);
router.get('/mis-recetas', verificarToken, obtenerMisRecetas);
router.put('/editar/:id', verificarToken, editarReceta);
router.delete('/eliminar/:id', verificarToken, eliminarReceta);
router.post('/calificar/:id', verificarToken, calificarReceta);

// RUTAS PÚBLICAS
router.get('/publicas', obtenerRecetasPublicas);
router.get('/publicas/:id', obtenerUnaRecetaPublica);

export default router;