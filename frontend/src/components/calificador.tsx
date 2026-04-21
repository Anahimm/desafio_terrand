import { useState } from 'react';
import styles from './calificador.module.css';

import imgPaulina from '../assets/chefs/paulina.jpg';
import imgDonato from '../assets/chefs/donato.jpg';
import imgMaru from '../assets/chefs/maru.jpg';
import imgBetular from '../assets/chefs/betular.jpg';
import imgMartitegui from '../assets/chefs/martitegui.jpg';

const COCINEROS = [
    { id: 1, nombre: "Paulina", img: imgPaulina },
    { id: 2, nombre: "Donato", img: imgDonato },
    { id: 3, nombre: "Maru", img: imgMaru },
    { id: 4, nombre: "Betular", img: imgBetular },
    { id: 5, nombre: "Martitegui", img: imgMartitegui }
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