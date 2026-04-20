import { useEffect, useState } from 'react';
import { obtenerMisRecetas, crearReceta, actualizarReceta, eliminarReceta } from '../services/recetas.service';
import { RecetaCard, type Receta } from '../components/recetaCard';
import { RecetaModal} from '../components/recetaModal';
import styles from './misRecetas.module.css';

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
                <div className={styles.headerInfo}>
                <h1>¡Hola, {nombre || 'Chef'}! 👩‍🍳</h1>
                <p>Acá podés gestionar todas tus recetas</p>
                </div>
                <button className={`${styles.btn} ${styles.btnNormal} ${styles.btnNaranja}`} onClick={abrirModalCrear}>
                    + Crear Receta
                </button>
            </header>

            {recetas.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Todavía no tenés recetas cargadas... 😔</p>
                </div>
            ) : (
                <div className={styles.gridRecetas}>
                    {recetas.map(receta => (
                        <RecetaCard
                            key={receta.id}
                            receta={receta}
                            onEditar={() => abrirModalEditar(receta)}
                            onEliminar={() => handleEliminar(receta.id)}
                            onCopiar={() => copiarLinkPublico(receta.id)}
                        />
                    ))}
                </div>
            )}

            <RecetaModal
                isOpen={isModalOpen}
                onClose={cerrarModal}
                onSubmit={handleSubmit}
                isEditing={!!recetaEditandoId}
                nuevaReceta={nuevaReceta}
                onChange={handleChange}
            />
        </div>
    );
};