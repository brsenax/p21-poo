import { Produto } from "../entities/produto.js";
import { ItemPedido } from "../entities/itemPedido.js";
import { ItemPedidoPromocional } from "../entities/itemPedidoPromocional.js";
import { Pedido } from "../entities/pedido.js";
import { Cliente } from "../entities/cliente.js"

//==============================================
// HU01 criar pedido e adicionar produtos
//==============================================
try {
    const cliente1 = new Cliente("João")
    const pedido1 = new Pedido(cliente1)

    const p1 = new Produto(1, "Café", 5.00)
    const p2 = new Produto(1, "Bolo", 8.00)
    const p3 = new Produto(1, "Suco", 6.00)

    const item1 = new ItemPedido(p1, 1)
    const item2 = new ItemPedido(p2, 1)
    const item3 =  new ItemPedido(p3, 1)

    pedido1.adicionarItem(item1)
    pedido1.adicionarItem(item2)
    pedido1.adicionarItem(item3)

    console.log(item1.toString())
    console.log(item2.toString())
    console.log(item3.toString())

    console.log(`Total do pedido: ${pedido1.calcularTotal().toFixed(2)}`)
} catch (error: unknown) {
    if (error instanceof Error) {
        console.log(`Erro validado: ${error.message}`)
    } else {
        console.error('Ocorreu um erro ineserado e desconhecido')
    }
}

//==============================================
// HU02 remover produto do pedido
//==============================================

//==============================================
// HU03 alterar quantidade de um produto
//==============================================

//==============================================
// HU04 finalizar pedido
//==============================================

//==============================================
// HU05 cancelarpedido
//==============================================