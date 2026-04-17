import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'; // Importamos las rutas

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectamos las rutas de autenticación bajo el prefijo "/api/auth"
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('¡El servidor del recetario está vivo! 🚀');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});