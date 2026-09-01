import { Cliente } from "./cliente.js"
import { ItemPedido } from "./itemPedido.js"

export type SituacaoPedido = "ABERTO" | "FINALIZADO" | "CANCELADO";

export class Pedido {
    private readonly _itens: ItemPedido[] = [];
    private _situacao: SituacaoPedido = "ABERTO";

    constructor(public readonly cliente: Cliente) {}

    public get situacao(): SituacaoPedido {
        return this._situacao;
    }

    private validarPedidoAberto(): void {
        if (this._situacao !== "ABERTO") {
            throw new Error(
                `Operação não permitida: pedido está ${this._situacao}`
            );
        }
    }

    public adicionarItem(item: ItemPedido): void {
        this.validarPedidoAberto();
        this._itens.push(item);
    }

    public removerItem(item: ItemPedido): void {
        this.validarPedidoAberto();
        const indice = this._itens.indexOf(item);
        if (indice >= 0) {
            this._itens.splice(indice, 1);
        }
    }

    public alterarQuantidade(item: ItemPedido, novaQuantidade: number): void {
        this.validarPedidoAberto();
        item.quantidade = novaQuantidade;
    }

    public finalizar(): void {
        this.validarPedidoAberto();
        this._situacao = "FINALIZADO";
    }

    public cancelar(): void {
        this.validarPedidoAberto();
        this._situacao = "CANCELADO";
    }

    public calcularTotal(): number {
        return this._itens.reduce(
            (total, item) => total + item.calcularSubtotal(),
            0
        )
    }
}
