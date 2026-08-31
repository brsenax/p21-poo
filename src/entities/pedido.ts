import { Cliente } from "./cliente.js"
import { ItemPedido } from "./itemPedido.js"

export class Pedido {
    private readonly _itens: ItemPedido[] = [];
    constructor(public readonly cliente: Cliente) {}

    public adicionarItem(item: ItemPedido): void {
        this._itens.push(item)
    }

    public removerItem(item: ItemPedido): void {
        const indice = this._itens.indexOf(item);

        if(indice >= 0) {
            this._itens.splice(indice, 1);
        }
    }

    public calcularTotal(): number {
        return this._itens.reduce(
            (total, item) => total + item.calcularSubtotal(),
            0
        )
    }
}
