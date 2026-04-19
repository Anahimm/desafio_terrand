import { useEffect, useState } from 'react';
import { obtenerMisRecetas, crearReceta, actualizarReceta, eliminarReceta } from '../services/recetas.service';
import styles from './misRecetas.module.css';

interface Receta {
    id: number;
    titulo: string;
    descripcion: string;
    ingredientes: string;
    imagen_url?: string;
    fecha_creacion: string;
    usuario_id: number;
}

export const MisRecetas = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [cargando, setCargando] = useState(true);

    // ESTADOS PARA EL MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recetaEditandoId, setRecetaEditandoId] = useState<number | null>(null);
    const [nuevaReceta, setNuevaReceta] = useState({
        titulo: '',
        descripcion: '',
        ingredientes: '',
        imagen_url: ''
    });

    const nombre = localStorage.getItem('nombreUsuario');

    const cargarRecetas = async () => {
        try {
            const data = await obtenerMisRecetas();
            setRecetas(data);
        } catch (error) {
            console.error("Error al cargar recetas:", error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarRecetas();
    }, []);

    // FUNCIONES PARA MANEJAR EL MODAL Y ELIMINAR

    const abrirModalCrear = () => {
        setRecetaEditandoId(null);
        setNuevaReceta({ titulo: '', descripcion: '', ingredientes: '', imagen_url: '' });
        setIsModalOpen(true);
    };

    const abrirModalEditar = (receta: Receta) => {
        setRecetaEditandoId(receta.id);
        setNuevaReceta({
            titulo: receta.titulo,
            descripcion: receta.descripcion,
            ingredientes: receta.ingredientes,
            imagen_url: receta.imagen_url || ''
        });
        setIsModalOpen(true);
    };

    const cerrarModal = () => {
        setIsModalOpen(false);
        setRecetaEditandoId(null);
        setNuevaReceta({ titulo: '', descripcion: '', ingredientes: '', imagen_url: '' });
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm('¿Está seguro de querer borrar esta receta?')) {
            try {
                await eliminarReceta(id);
                cargarRecetas();
            } catch (error) {
                alert("Error al eliminar la receta");
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (recetaEditandoId) {
                await actualizarReceta(recetaEditandoId, nuevaReceta);
            } else {
                await crearReceta(nuevaReceta);
            }
            cerrarModal();
            cargarRecetas();
        } catch (error) {
            alert(recetaEditandoId ? "Error al editar la receta" : "Hubo un error al crear la receta");
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNuevaReceta({ ...nuevaReceta, [e.target.name]: e.target.value });
    };

    const copiarLinkPublico = (id: number) => {
        const urlPublica = `${window.location.origin}/receta/${id}`;
        navigator.clipboard.writeText(urlPublica)
            .then(() => {
                alert("Link copiado en el portapapeles");
            })
            .catch(err => {
                console.error("Error al copiar:", err);
            });
    };

    if (cargando) return <div className={styles.loader}>Cargando tu recetario...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>¡Hola, {nombre || 'Chef'}! 👩‍🍳</h1>
                <p>Recetas propias</p>
                <button className={`${styles.btn} ${styles.btnNormal} ${styles.btnRojo}`} style={{ marginTop: '1rem' }} onClick={abrirModalCrear}>
                    + Crear Receta
                </button>
            </header>

            {recetas.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Todavía no tenés recetas</p>
                </div>
            ) : (
                <div className={styles.gridRecetas}>
                    {recetas.map(receta => (
                        <article key={receta.id} className={styles.card}>
                            {receta.imagen_url && (
                                <div className={styles.imageWrapper}>
                                    <img src={receta.imagen_url} alt={receta.titulo} />
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
                                    <button onClick={() => abrirModalEditar(receta)} className={`${styles.btn} ${styles.btnChico} ${styles.btnOutlineAzul}`}>Editar</button>
                                    <button onClick={() => handleEliminar(receta.id)} className={`${styles.btn} ${styles.btnChico} ${styles.btnOutlineRojo}`}>Eliminar</button>
                                    <button
                                        onClick={() => copiarLinkPublico(receta.id)}
                                        className={`${styles.btn} ${styles.btnChico} ${styles.btnGris}`}
                                    >
                                        🔗 Copiar Link
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>{recetaEditandoId ? 'Editar Receta' : 'Nueva Receta'}</h2>

                        <form onSubmit={handleSubmit} className={styles.formReceta}>
                            <input
                                type="text" name="titulo" placeholder="Título de la receta" required
                                value={nuevaReceta.titulo} onChange={handleChange}
                            />
                            <textarea
                                name="descripcion" placeholder="Descripción" required
                                value={nuevaReceta.descripcion} onChange={handleChange}
                            />
                            <textarea
                                name="ingredientes" placeholder="Ingredientes" required
                                value={nuevaReceta.ingredientes} onChange={handleChange}
                            />
                            <input
                                type="url" name="imagen_url" placeholder="Link de una imagen (Opcional)"
                                value={nuevaReceta.imagen_url} onChange={handleChange}
                            />

                            <div className={styles.modalBotones}>
                                <button type="button" className={`${styles.btn} ${styles.btnNormal} ${styles.btnGris}`} onClick={cerrarModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className={`${styles.btn} ${styles.btnNormal} ${styles.btnRojo}`}>
                                    {recetaEditandoId ? 'Guardar Cambios' : 'Guardar Receta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};