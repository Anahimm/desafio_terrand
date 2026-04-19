import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Login } from './pages/login';
import { Registro } from './pages/registro';
import { MisRecetas } from './pages/misRecetas';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-recetas" element={<MisRecetas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;