import { Obra } from "./obra";
import { Puja, Subasta } from "./subasta";

export class Artista {
    private _saldo: number = 0;
    private _obras: Obra[] = [];

    constructor(public readonly _id: string, public nombre: string) { }

    get saldo(): number {
        return this._saldo;
    }

    set saldo(saldo: number) {
        this._saldo = saldo;
    }

    get obras(): Obra[] {
        return this._obras;
    }

    agregarSaldo(cantidad: number): void {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor que 0.');
        }
        this._saldo += cantidad;
    }

    retirarSaldo(cantidad: number): void {
        if (cantidad > this._saldo) {
            throw new Error('Saldo insuficiente.');
        }
        this._saldo -= cantidad;
    }

    registrarObra(obra: Obra): void {
        this._obras.push(obra);
    }

    retirarObra(idObra: String): void {
        const elem = this._obras.find(obra => obra._id === idObra);
        if (elem !== undefined) {
            const idx = this._obras.indexOf(elem);

            if (idx !== -1) {
                this._obras.splice(idx, 1);
            }
        }
    }

    pujar(puja: number, subasta: Subasta): void {
        if (puja <= subasta.getPrecioActual()) {
            throw new Error('La puja debe ser mayor que el precio actual.');
        } else if ((subasta.getPrecioActual() + subasta.incremento) > puja) {
            throw new Error('La puja debe ser mayor que la suma del incremento con el precio actual.');
        } else {
            const p: Puja = { cantidad: puja, user: this };
            subasta.recibirPuja(p);
        }
    }
}
