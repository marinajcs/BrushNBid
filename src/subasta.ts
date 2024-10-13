import { Obra } from './obra';
import { Artista } from './artista';

export class Puja {
    constructor(public cantidad: number, public user: Artista) { }

    mostrarPuja(): string {
        return `${this.user} ha pujado ${this.cantidad}€. `;
    }
}

export class Subasta {

    constructor(
        public obra: Obra,
        public pujas: Puja[],
        readonly precioInicial: number = 0,
        readonly precioReserva: number = 0,
        readonly incremento: number = 10
    ) { }

    getPrecioActual(): number {
        if (this.pujas.length === 0) {
            return this.precioInicial;
        } else {
            return this.pujas[this.pujas.length - 1].cantidad;
        }
    }

    getMejorPostor(): Artista | null {
        if (this.pujas.length !== 0) {
            return this.pujas[this.pujas.length - 1].user;
        } else {
            return null;
        }
    }

    recibirPuja(comprador: Artista, puja: number): void {
        if (puja <= this.getPrecioActual()) {
            throw new Error('La puja debe ser mayor que el precio actual');
        } else if ((this.getPrecioActual() + this.incremento) > puja) {
            throw new Error('La puja debe ser mínimo ' + this.incremento + '€ mayor que la actual');
        } else {
            this.pujas.push(new Puja(puja, comprador));
        }
    }

    adjudicarLote(): void {
        const mejorPostor = this.getMejorPostor();
        if (mejorPostor !== null) {
            this.obra.transferirObra(mejorPostor);
        }
    }

}
