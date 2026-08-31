import { Produto } from "./produto.js";

export class ItemPedido {
    constructor(
        public readonly produto: Produto,
        private _quantidade: number
    ) {
        this.validarQuantidade(_quantidade);
    }

    public get quantidade(): number {
        return this._quantidade;
    }

    public calcularSubtotal(): number {
        return this.produto.preco * this._quantidade;
    }

    private validarQuantidade(qtd: number): void {
        if (qtd <= 0) {
            throw new Error("A quantidade de um item deve ser maior que zero.");
        }
    }

    public toString(): string {
        return `${this._quantidade} x [${this.produto.nome}] | Subtotal: R$ ${this.calcularSubtotal().toFixed(2)}`;
    }
}   