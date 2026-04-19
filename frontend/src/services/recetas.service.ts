const API_URL = 'http://localhost:3000/api/recetas';

export const obtenerMisRecetas = async () => {
    const token = localStorage.getItem('token');

    const respuesta = await fetch(`${API_URL}/mis-recetas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al obtener recetas');
    }
    return data;
};

interface DatosNuevaReceta {
    titulo: string;
    descripcion: string;
    ingredientes: string;
    imagen_url?: string;
}

export const crearReceta = async (datos: DatosNuevaReceta) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/crear`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al crear la receta');
    }

    return data;
};

export const actualizarReceta = async (id: number, datos: DatosNuevaReceta) => {
    const token = localStorage.getItem('token');

    const respuesta = await fetch(`${API_URL}/editar/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar la receta');
    }

    return data;
};

export const eliminarReceta = async (id: number) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`${API_URL}/eliminar/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al eliminar la receta');
    }

    return data;
};

export const obtenerRecetaPublica = async (id: string) => {
    const respuesta = await fetch(`http://localhost:3000/api/recetas/publicas/${id}`, {
        method: 'GET'
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(data.error || 'Error al obtener la receta pública');
    }

    return data;
};