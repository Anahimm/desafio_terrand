import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { MisRecetas } from './pages/misRecetas';
import { RecetaPublica } from './pages/recetaPublica';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/mis-recetas" element={<MisRecetas />} />
            <Route path="/receta/:id" element={<RecetaPublica />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;