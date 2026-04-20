import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
    const { nombreUsuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        cerrarSesion();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    Las recetas de Anahí 🍰
                </Link>
            </div>

            <ul className={styles.links}>
                {nombreUsuario ? (
                    <>
                        <li><Link to="/mis-recetas">Mis Recetas</Link></li>
                        <li className={styles.userName}>Hola, {nombreUsuario}</li>
                        <li>
                            <button onClick={handleLogout} className={styles.btnLogout}>
                                Cerrar Sesión
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/registro">Registrarse</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};