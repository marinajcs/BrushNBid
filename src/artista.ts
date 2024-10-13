import { Obra } from "./obra";

export class Artista {
    private _saldo: number = 0;
    private _obras: Obra[] = [];

    constructor(public readonly _id: string, public nombre: string) {}

    get saldo(): number {
        return this._saldo;
    }

    get obras(): Obra[] {
        return this._obras;
    }

    agregarSaldo(cantidad: number): void {
        if (cantidad < 0) {
            throw new Error('La cantidad debe ser mayor que 0');
        }
        this._saldo += cantidad;
    }

    restarSaldo(cantidad: number): void {
        if (cantidad > this._saldo) {
            throw new Error('Saldo insuficiente');
        }
        this._saldo -= cantidad;
    }

    agregarObra(obra: Obra): void {
        this._obras.push(obra);
    }
}
