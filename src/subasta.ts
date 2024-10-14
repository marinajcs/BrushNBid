import { Obra } from './obra';
import { Artista } from './artista';

export type Puja = {
    cantidad: number,
    user: Artista
}

export class Subasta {
    public historialPujas: Puja[] = [];
    public participantes = new Map<Artista, number>();

    constructor(
        private readonly _id: string,
        public obra: Obra,
        public vendedor: Artista,
        readonly precioInicial: number = 0,
        readonly incremento: number = 0,
        readonly precioReserva: number = 0
    ) { }

    getPrecioActual(): number {
        if (this.historialPujas.length === 0) {
            return this.precioInicial;
        } else {
            return this.historialPujas[this.historialPujas.length - 1].cantidad;
        }
    }

    getMejorPostor(): Artista | null {
        if (this.historialPujas.length !== 0) {
            return this.historialPujas[this.historialPujas.length - 1].user;
        } else {
            return null;
        }
    }

    recibirPuja(puja: Puja): void {
        this.historialPujas.push(puja);
        if (this.participantes.has(puja.user)) {
            const ultimaPuja = this.participantes.get(puja.user) || 0;
            puja.user.retirarSaldo(puja.cantidad - ultimaPuja);
        } else {
            puja.user.retirarSaldo(puja.cantidad);
        }
        this.participantes.set(puja.user, puja.cantidad);
    }

    adjudicarLote(): string {
        const mejorPostor = this.getMejorPostor();
        if (mejorPostor !== null) {
            const remate = this.getPrecioActual();

            if (this.precioReserva < remate) {
                const ganancia = this.calcularComision(remate);

                this.vendedor.agregarSaldo(ganancia);
                this.obra.transferirPropiedad(mejorPostor);
                this.vendedor.retirarObra(this.obra._id);
                this.devolverDinero(true, mejorPostor);

                return 'Se ha adjudicado el lote al mejor postor(a).'
            } else {
                this.devolverDinero(false);
                return 'No se ha llegado al precio de reserva así que no se adjudica el lote.'
            }
        } else {
            const msj = 'No se ha pujado aún por esta obra.'
            throw new Error(msj);
        }
    }

    calcularComision(precio: number): number {
        const comision = precio * 5 / 100;
        return (precio - comision);
    }

    devolverDinero(adjudicado: boolean, compradorFinal?: Artista): void {
        const historial = this.historialPujas;
        const devoluciones = new Map<Artista, number>();

        for (let i = historial.length - 1; i >= 0; i--) {
            const puja = historial[i];

            if (!devoluciones.has(puja.user) && (!adjudicado || (adjudicado && compradorFinal != puja.user))) {
                devoluciones.set(puja.user, puja.cantidad);
                puja.user.agregarSaldo(puja.cantidad);
            }
        }
    }
}


