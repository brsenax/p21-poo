import { Cliente } from "../entities/cliente.js"
import { Produto } from "../entities/produto.js"
import { Pedido } from "../entities/pedido.js"
import { ItemPedido } from "../entities/itemPedido.js"

export class PedidoService {
    criarPedido(cliente: Cliente): Pedido {
        return new Pedido(cliente);
    }

    adicionarProduto(
        produto: Produto,
        pedido: Pedido,
        quantidade: number
    ): void {
        const item = new ItemPedido(
            produto,
            quantidade
        );

        pedido.adicionarItem(item)
    }
}