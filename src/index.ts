import { Produto } from "./entities/produto.js";
import { ItemPedido } from "./entities/itemPedido.js";
import { ItemPedidoPromocional } from "./entities/itemPedidoPromocional.js";
import { Pedido } from "./entities/pedido.js";
import { Cliente } from "./entities/cliente.js"


try {
//==============================================
// HU01 criar pedido e adicionar produtos
//==============================================
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

//==============================================
// HU02 remover produto do pedido
//==============================================
    pedido1.removerItem(item1)
    console.log('---Após remover o café---')

    console.log(`Pedido recalculado: ${pedido1.calcularTotal().toFixed(2)}`)

//==============================================
// HU03 alterar quantidade de um produto
//==============================================
    console.log('---Altera quantidade de bolo---')
    item2.quantidade = 5

    console.log(`Total recalculado: ${pedido1.calcularTotal().toFixed(2)}`)


    //==============================================
// HU04 finalizar pedido
//==============================================
    console.log('---Situação inicial---')
    console.log(pedido1.situacao)

    pedido1.finalizar()
    console.log('---Após finalizar---')
    console.log(pedido1.situacao)

    try {
        pedido1.adicionarItem(item3)
    } catch (e) {
        console.log(`Rejeitado (adicionar): ${(e as Error).message}`)
    }

    try {
        pedido1.removerItem(item2)
    } catch (e) {
        console.log(`Rejeitado (remover): ${(e as Error).message}`)
    }

    try {
        pedido1.alterarQuantidade(item2, 10)
    } catch (e) {
        console.log(`Rejeitado (alterar quantidade): ${(e as Error).message}`)
    }

//==============================================
// HU05 cancelar pedido
//==============================================
    const cliente2 = new Cliente("Maria")
    const pedido2 = new Pedido(cliente2)
    const p4 = new Produto(2, "Café", 5.00)
    const p5 = new Produto(3, "Suco", 6.00)
    pedido2.adicionarItem(new ItemPedido(p4, 2))
    pedido2.adicionarItem(new ItemPedido(p5, 1))

    console.log('---Situação inicial pedido2---')
    console.log(pedido2.situacao)

    pedido2.cancelar()
    console.log('---Após cancelar---')
    console.log(pedido2.situacao)

    try {
        pedido2.adicionarItem(new ItemPedido(p4, 1))
    } catch (e) {
        console.log(`Rejeitado (adicionar): ${(e as Error).message}`)
    }

    try {
        pedido1.cancelar()
    } catch (e) {
        console.log(`Rejeitado (cancelar pedido finalizado): ${(e as Error).message}`)
    }

} catch (error: unknown) {
    if (error instanceof Error) {
        console.log(`Erro validado: ${error.message}`)
    } else {
        console.error('Ocorreu um erro ineserado e desconhecido')
    }
}

