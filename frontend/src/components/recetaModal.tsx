import styles from '../pages/misRecetas.module.css';

interface RecetaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing: boolean;
    nuevaReceta: {
        titulo: string;
        descripcion: string;
        ingredientes: string;
        imagen_url?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const RecetaModal = ({ isOpen, onClose, onSubmit, isEditing, nuevaReceta, onChange }: RecetaModalProps) => {
    if (!isOpen) return null; 
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{isEditing ? 'Editar Receta' : 'Nueva Receta'}</h2>

                <form onSubmit={onSubmit} className={styles.formReceta}>
                    <input
                        type="text" name="titulo" placeholder="Título de la receta" required
                        value={nuevaReceta.titulo} onChange={onChange}
                    />
                    <textarea
                        name="descripcion" placeholder="Descripción" required
                        value={nuevaReceta.descripcion} onChange={onChange}
                    />
                    <textarea
                        name="ingredientes" placeholder="Ingredientes" required
                        value={nuevaReceta.ingredientes} onChange={onChange}
                    />
                    <input
                        type="url" name="imagen_url" placeholder="Link de una imagen (Opcional)"
                        value={nuevaReceta.imagen_url || ''} onChange={onChange}
                    />

                    <div className={styles.modalBotones}>
                        <button type="button" className={`${styles.btn} ${styles.btnNormal} ${styles.btnGris}`} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={`${styles.btn} ${styles.btnNormal} ${styles.btnRojo}`}>
                            {isEditing ? 'Guardar Cambios' : 'Guardar Receta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};