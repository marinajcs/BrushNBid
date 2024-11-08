import { users } from './artistas';
import { TipoObra, Obra } from '../src/models/obra';

export let lotes: Obra[] = [
    new Obra("o1", "El amanecer", users[0], users[0], TipoObra.Pintura, "Óleo sobre lienzo, 30x40."),
    new Obra("o2", "Tótem", users[0], users[0], TipoObra.Escultura, "Madera de cedro barnizada, 21x36x10."),
    new Obra("o3", "Voces silenciadas", users[0], users[0], TipoObra.Fotografia, "Representación de la censura, 10x15."),
];

