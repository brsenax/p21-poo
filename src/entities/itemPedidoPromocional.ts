//import substitui o require
import { ItemPedido } from "./itemPedido.js";
import { Produto } from "./produto.js";

export class ItemPedidoPromocional extends ItemPedido {
    private _desconto: number;
//4
    constructor(produto: Produto, quantidade: number, desconto?: number) {

        super(produto, quantidade);

        this._desconto = desconto ?? 0.10; //5
    }
//6
    public override calcularSubtotal(): number {
        const subtotalOriginal = super.calcularSubtotal();

        return subtotalOriginal * (1 - this._desconto);
    }

    public override toString(): string {
        const porcentagem = (this._desconto * 100).toFixed(0);

        return `${super.toString()} (Desconto Aplicado: ${porcentagem}%)`;
    }
}