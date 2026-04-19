import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">Las recetas de Anahí 🍰</Link>
            </div>

            <ul className={styles.links}>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/registro">Registrarse</Link></li>
                <li><Link to="/mis-recetas">Mis Recetas</Link></li>
            </ul>
        </nav>
    );
};