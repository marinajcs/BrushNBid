import { expect } from 'chai';
import { Subasta } from '../src/subasta';
import { users } from '../data/artistas';
import { lotes } from '../data/obras';

describe('Validaciones al realizar una puja', () => {

    it('debería lanzar una excepción si la primera puja es una cantidad menor que el precio inicial', () => {
        try {
            const subasta = new Subasta("s1", lotes[0], users[0], 20, 10, 250);
            users[1].agregarSaldo(subasta.precioInicial);
            users[1].pujar(subasta.precioInicial - 1, subasta);

            throw new Error('Se esperaba una excepción pero no se lanzó.');
        } catch (error) {
            const typedError = error as Error;
            expect(typedError instanceof Error).to.be.true;
            expect(typedError.message).to.equal('La puja debe ser mayor que el precio actual.');
        }
    });

    it('debería lanzar una excepción si se intenta pujar por una cantidad menor que la puja actual', () => {
        try {
            const subasta = new Subasta("s1", lotes[0], users[0], 20, 10, 250);
            const pujaMinima = subasta.precioInicial + subasta.incremento;
            users[1].agregarSaldo(pujaMinima*3);
            users[2].agregarSaldo(pujaMinima*3);
            users[1].pujar(pujaMinima, subasta);
            users[2].pujar(pujaMinima - 1, subasta);

            throw new Error('Se esperaba una excepción pero no se lanzó.');
        } catch (error) {
            const typedError = error as Error;
            expect(typedError instanceof Error).to.be.true;
            expect(typedError.message).to.equal('La puja debe ser mayor que el precio actual.');
        }
    });

    it('debería lanzar una excepción si se intenta pujar por una cantidad menor que el incremento + el actual', () => {
        try {
            const subasta = new Subasta("s1", lotes[0], users[0], 20, 10, 250);
            const pujaMinima = subasta.precioInicial + subasta.incremento;
            users[1].agregarSaldo(pujaMinima*3);
            users[2].agregarSaldo(pujaMinima*3);
            users[1].pujar(pujaMinima, subasta);
            users[2].pujar(pujaMinima + subasta.incremento - 1, subasta);

            throw new Error('Se esperaba una excepción pero no se lanzó.');
        } catch (error) {
            const typedError = error as Error;
            expect(typedError instanceof Error).to.be.true;
            expect(typedError.message).to.equal('La puja debe ser mayor que la suma del incremento con el precio actual.');
        }
    });

    it('debería lanzar una excepción si se intenta pujar por una cantidad mayor que su saldo', () => {
        try {
            const subasta = new Subasta("s1", lotes[0], users[0], 20, 10, 250);
            const pujaMinima = subasta.precioInicial + subasta.incremento;
            users[1].saldo = 0;
            users[1].pujar(pujaMinima, subasta);

            throw new Error('Se esperaba una excepción pero no se lanzó.');
        } catch (error) {
            const typedError = error as Error;
            expect(typedError instanceof Error).to.be.true;
            expect(typedError.message).to.equal('Saldo insuficiente.');
        }
    });

});

describe('Validaciones al finalizar una subasta y adjudicarse un lote', () => {

    function transferenciaObraExitosa(s: Subasta): boolean {
        const propiedadActualizada = s.obra.propiedad === s.getMejorPostor();
        const obraRegistradaEnComprador = s.getMejorPostor()?.obras.find(obra => s.obra._id == obra._id) !== undefined;
        const obraRetiradaEnVendedor = s.vendedor.obras.find(obra => s.obra._id == obra._id) === undefined;

        return (propiedadActualizada && obraRegistradaEnComprador && obraRetiradaEnVendedor);
    }

    it('la propiedad de la obra debería transferirse correctamente', () => {
        const subasta = new Subasta("s1", lotes[0], users[0], 20, 10);
        const pujaMinima = subasta.precioInicial + subasta.incremento;
        users[1].saldo = 0;
        users[1].agregarSaldo(pujaMinima*2);
        users[1].pujar(pujaMinima, subasta);
        subasta.adjudicarLote();

        expect(transferenciaObraExitosa(subasta)).to.be.true;
    });

    it('el comprador paga el precio de martillo y el vendedor recibe dicha cantidad menos el % de comisión', () => {
        const subasta = new Subasta("s1", lotes[0], users[0], 20, 10);
        const pujaMinima = subasta.precioInicial + subasta.incremento;
        const saldoInicial = pujaMinima*2;
        const remate = pujaMinima;
        users[0].saldo = users[1].saldo = 0;
        users[1].agregarSaldo(saldoInicial);
        users[1].pujar(remate, subasta);
        subasta.adjudicarLote();

        expect(subasta.getMejorPostor()?.saldo).to.equal(saldoInicial - remate);
        expect(subasta.vendedor.saldo).to.equal(remate - (remate*5/100));
    });

    it('quienes hayan participado pero no hayan ganado reciben la cantidad pujada de vuelta', () => {
        const subasta = new Subasta("s1", lotes[0], users[0], 20, 10);
        const pujaMinima = subasta.precioInicial + subasta.incremento;
        const saldoInicial = pujaMinima*3;
        const puja1 = pujaMinima + pujaMinima/2;
        const puja2 = pujaMinima*2;
        users[1].saldo = users[2].saldo = 0;

        users[1].agregarSaldo(saldoInicial);
        users[2].agregarSaldo(saldoInicial);

        users[1].pujar(puja1, subasta);
        users[2].pujar(puja2, subasta);
        subasta.adjudicarLote();

        expect(users[1].saldo).to.equal(saldoInicial);

    });

    it('si no se alcanza el precio de reserva al final de la subasta, no se adjudica el lote', () => {
        const subasta = new Subasta("s1", lotes[1], users[1], 20, 10, 200);
        const pujaMinima = subasta.precioInicial + subasta.incremento;
        const saldoInicial = pujaMinima*3;
        const puja1 = pujaMinima + pujaMinima/2;
        const puja2 = pujaMinima*2;
        users[0].saldo = users[2].saldo = 0;

        users[0].agregarSaldo(saldoInicial);
        users[2].agregarSaldo(saldoInicial);

        users[0].pujar(puja1, subasta);
        users[2].pujar(puja2, subasta);
        subasta.adjudicarLote();

        expect(transferenciaObraExitosa(subasta)).to.be.false;
        expect(users[2].saldo).to.equal(saldoInicial);

    });

});