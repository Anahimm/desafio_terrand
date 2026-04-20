import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion as loginAPI } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';

export const Login = () => {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const respuesta = await loginAPI({
                email: formData.email,
                password: formData.password
            });
            const nombreUsuario = respuesta.usuario?.nombre || 'Chef';
            iniciarSesion(nombreUsuario, respuesta.token);

            alert(`¡Bienvenida/o de vuelta, ${nombreUsuario}!`);
            navigate('/mis-recetas');

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error de conexión desconocido');
            }
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.inputContainer}>
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Correo Electrónico"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputContainer}>
                    <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </span>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Entrar</button>
                <p className={styles.linkText}>
                    ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
                </p>
            </form>
        </div>
    );
};