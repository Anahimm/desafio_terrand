import styles from '../pages/misRecetas.module.css';

export interface Receta {
    id: number;
    titulo: string;
    descripcion: string;
    ingredientes: string;
    imagen_url?: string;
    fecha_creacion: string;
    usuario_id: number;
}

interface RecetaCardProps {
    receta: Receta;
    onEditar: () => void;
    onEliminar: () => void;
    onCopiar: () => void;
}

export const RecetaCard = ({ receta, onEditar, onEliminar, onCopiar }: RecetaCardProps) => {
    return (
        <article className={styles.card}>
            {receta.imagen_url && (
                <div className={styles.imageWrapper}>
                    <img 
                        src={receta.imagen_url} 
                        alt={receta.titulo}
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=500&q=80';
                        }} 
                    />
                </div>
            )}
            <div className={styles.cardBody}>
                <span className={styles.fecha}>
                    {new Date(receta.fecha_creacion).toLocaleDateString()}
                </span>
                <h3>{receta.titulo}</h3>
                <p className={styles.descripcion}>{receta.descripcion}</p>
                <div className={styles.detalles}>
                    <strong>Ingredientes:</strong>
                    <p>{receta.ingredientes}</p>
                </div>

                <div className={styles.accionesReceta}>
                    <button onClick={onEditar} className={`${styles.btn} ${styles.btnChico} ${styles.btnOutlineAzul}`}>
                        Editar
                    </button>
                    <button onClick={onEliminar} className={`${styles.btn} ${styles.btnChico} ${styles.btnOutlineRojo}`}>
                        Eliminar
                    </button>
                    <button onClick={onCopiar} className={`${styles.btn} ${styles.btnChico} ${styles.btnGris}`}>
                        🔗 Copiar Link
                    </button>
                </div>
            </div>
        </article>
    );
};