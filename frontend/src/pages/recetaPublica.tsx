import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerRecetaPublica } from '../services/recetas.service';
import styles from './misRecetas.module.css'; 

interface RecetaPublica {
    id: number;
    titulo: string;
    descripcion: string;
    ingredientes: string;
    imagen_url?: string;
    fecha_creacion: string;
    usuario: {
        nombre: string;
        apellido: string;
    };
}

export const RecetaPublica = () => {
    const { id } = useParams<{ id: string }>(); 
    const [receta, setReceta] = useState<RecetaPublica | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarReceta = async () => {
            if (!id) return;
            try {
                const data = await obtenerRecetaPublica(id);
                setReceta(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        cargarReceta();
    }, [id]);

    if (cargando) return <div className={styles.loader}>Cargando receta...</div>;
    
    if (error || !receta) return (
        <div className={styles.container} style={{textAlign: 'center', marginTop: '5rem'}}>
            <h2>Ups, no encontramos esta receta 😕</h2>
            <p>{error}</p>
            <Link to="/" className={`${styles.btn} ${styles.btnNormal} ${styles.btnRojo}`}>Ir al inicio</Link>
        </div>
    );

    return (
        <div className={styles.container} style={{maxWidth: '800px'}}>
            <article className={styles.card}>
                {receta.imagen_url && (
                    <div style={{width: '100%', height: '400px', overflow: 'hidden'}}>
                        <img 
                            src={receta.imagen_url} 
                            alt={receta.titulo} 
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                    </div>
                )}
                
                <div className={styles.cardBody} style={{padding: '3rem'}}>
                    <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem', color: '#333'}}>
                        {receta.titulo}
                    </h1>
                    
                    <p style={{color: '#888', marginBottom: '2rem'}}>
                        👨‍🍳 Creado por: <strong>{receta.usuario.nombre} {receta.usuario.apellido}</strong> <br/>
                        📅 {new Date(receta.fecha_creacion).toLocaleDateString()}
                    </p>

                    <h3 style={{color: '#e63946'}}>Descripción</h3>
                    <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', color: '#444'}}>
                        {receta.descripcion}
                    </p>

                    <h3 style={{color: '#e63946'}}>Ingredientes</h3>
                    <div style={{background: '#fff9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ffe5e9'}}>
                        <p style={{fontSize: '1.1rem', whiteSpace: 'pre-wrap', margin: 0, color: '#444'}}>
                            {receta.ingredientes}
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};