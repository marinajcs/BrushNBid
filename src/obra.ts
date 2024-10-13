import { Artista } from './artista';

enum TipoObra {
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
    ) {}

    transferirObra(nuevaPropiedad: Artista): void {
        this.propiedad = nuevaPropiedad;
    }
}
