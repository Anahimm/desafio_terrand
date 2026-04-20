import React, { useState } from 'react';
import styles from './Calificador.module.css';

const COCINEROS = [
    { id: 1, nombre: "Paulina", img: "/chefs/paulina.jpg" },
    { id: 2, nombre: "Donato", img: "/chefs/donato.jpg" },
    { id: 3, nombre: "Maru", img: "/chefs/maru.jpg" },
    { id: 4, nombre: "Betular", img: "/chefs/betular.jpg" },
    { id: 5, nombre: "Martitegui", img: "/chefs/martitegui.jpg" }
];

interface Props {
    puntaje: number;
    onCalificar: (valor: number) => void;
}

export const Calificador = ({ puntaje, onCalificar }: Props) => {
    const [hover, setHover] = useState(0);

    return (
        <div className={styles.contenedor}>
            {COCINEROS.map((chef) => {
                const activo = chef.id <= (hover || puntaje);
                
                return (
                    <img
                        key={chef.id}
                        src={chef.img}
                        alt={chef.nombre}
                        onMouseEnter={() => setHover(chef.id)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => onCalificar(chef.id)}
                        className={`${styles.chefSticker} ${activo ? styles.chefActivo : ''}`}
                    />
                );
            })}
        </div>
    );
};