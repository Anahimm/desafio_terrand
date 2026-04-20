import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import styles from './Registro.module.css';

export const Registro = () => {
    const navigate = useNavigate();
    const { iniciarSesion } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmarPassword: ''
    });

    const [error, setError] = useState('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página recargue
        setError('');

        //confirmación de contraseña
        if (formData.password !== formData.confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const respuesta = await registrarUsuario({
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password
            });

            if (respuesta && respuesta.token) {
                iniciarSesion(formData.nombre, respuesta.token);
                alert(`¡Cuenta creada con éxito! Bienvenida/o, ${formData.nombre}.`);
                navigate('/mis-recetas');
            } else {
                alert('¡Usuario creado con éxito! Por favor, iniciá sesión.');
                navigate('/login');
            }

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
                <h2>Crear Cuenta</h2>
                {error && <p className={styles.error}>{error}</p>}

                <input type="text" name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleChange} required />
                <input type="text" name="apellido" value={formData.apellido} placeholder="Apellido" onChange={handleChange} required />
                <input type="email" name="email" value={formData.email} placeholder="Correo Electrónico" onChange={handleChange} required />
                <input type="password" name="password" value={formData.password} placeholder="Contraseña" minLength={6} onChange={handleChange} required />
                <input type="password" name="confirmarPassword" value={formData.confirmarPassword} placeholder="Repetir Contraseña" minLength={6} onChange={handleChange} required />

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};