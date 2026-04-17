import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; // Importamos las rutas
import recetasRoutes from './routes/recetas.routes';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conecto las rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetasRoutes);


app.get('/', (req, res) => {
    res.send('El servidor del recetario esta levantado');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});