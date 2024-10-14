import { Artista } from './artista';

export enum TipoObra {
    Escultura = "escultura",
    Pintura = "pintura",
    Fotografia = "fotografia",
    Otras = "otras"
}

export class Obra {

    constructor(
        public readonly _id: string,
        public titulo: string,
        public autoria: Artista,
        public propiedad: Artista,
        public tipo: TipoObra,
        public descripcion?: string,
        public imagen?: string
    ) { }

    transferirPropiedad(nuevaPropiedad: Artista): void {
        this.propiedad = nuevaPropiedad;
        nuevaPropiedad.registrarObra(this);
    }
}
