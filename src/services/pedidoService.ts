import type { Cliente } from "../entities/cliente.js";
import { Produto } from "../entities/produto.js";
import { Pedido } from "../entities/pedido.js";
import type { SituacaoPedido } from "../entities/pedido.js";
import { ItemPedido } from "../entities/itemPedido.js";
import type { ProdutoRepository } from "../repositories/produtoRepository.js";
import type { PedidoRepository } from "../repositories/pedidoRepository.js";
import type { ResumoVendas } from "./resumoVendas.js";

export class PedidoService {
    constructor(
        private readonly produtoRepository: ProdutoRepository,
        private readonly pedidoRepository: PedidoRepository
    ) {}

    // ---------- Cardápio (HU06, HU07) ----------

    cadastrarProduto(codigo: number, nome: string, preco: number): Produto {
        if (this.produtoRepository.buscarPorId(codigo) !== undefined) {
            throw new Error(`Já existe um produto com o código ${codigo}.`);
        }
        const produto = new Produto(codigo, nome, preco);
        this.produtoRepository.salvar(produto);
        return produto;
    }

    listarCardapio(): Produto[] {
        return this.produtoRepository.listar();
    }

    consultarProduto(codigo: number): Produto {
        const produto = this.produtoRepository.buscarPorId(codigo);
        if (produto === undefined) {
            throw new Error(`Produto ${codigo} não encontrado.`);
        }
        return produto;
    }

    // ---------- Pedidos (HU08) ----------

    criarPedido(cliente: Cliente): Pedido {
        const pedido = new Pedido(this.pedidoRepository.proximoNumero(), cliente);
        this.pedidoRepository.salvar(pedido);
        return pedido;
    }

    consultarPedido(numero: number): Pedido {
        const pedido = this.pedidoRepository.buscarPorNumero(numero);
        if (pedido === undefined) {
            throw new Error(`Pedido ${numero} não encontrado.`);
        }
        return pedido;
    }

    adicionarProduto(
        numeroPedido: number,
        codigoProduto: number,
        quantidade: number
    ): void {
        const pedido = this.consultarPedido(numeroPedido);
        const produto = this.consultarProduto(codigoProduto);
        const novoItem = new ItemPedido(produto, quantidade); // valida a quantidade

        const itemExistente = pedido.buscarItem(codigoProduto);
        if (itemExistente === undefined) {
            pedido.adicionarItem(novoItem);
        } else {
            // mesmo produto duas vezes: soma na linha existente
            pedido.alterarQuantidade(
                itemExistente,
                itemExistente.quantidade + novoItem.quantidade
            );
        }
    }

    removerProduto(numeroPedido: number, codigoProduto: number): void {
        const pedido = this.consultarPedido(numeroPedido);
        this.consultarProduto(codigoProduto);
        pedido.removerItem(this.obterItem(pedido, codigoProduto));
    }

    alterarQuantidade(
        numeroPedido: number,
        codigoProduto: number,
        novaQuantidade: number
    ): void {
        const pedido = this.consultarPedido(numeroPedido);
        this.consultarProduto(codigoProduto);
        pedido.alterarQuantidade(
            this.obterItem(pedido, codigoProduto),
            novaQuantidade
        );
    }

    finalizarPedido(numeroPedido: number): void {
        this.consultarPedido(numeroPedido).finalizar();
    }

    cancelarPedido(numeroPedido: number): void {
        this.consultarPedido(numeroPedido).cancelar();
    }

    // ---------- Acompanhamento (HU09, HU10) ----------

    listarPedidosPorSituacao(situacao: SituacaoPedido): Pedido[] {
        return this.pedidoRepository.buscarPorSituacao(situacao);
    }

    resumirVendas(): ResumoVendas {
        const vendidos = this.pedidoRepository.buscarPorSituacao("FINALIZADO");
        const totalVendido = vendidos.reduce(
            (soma, pedido) => soma + pedido.calcularTotal(),
            0
        );
        const quantidadePedidos = vendidos.length;
        return {
            quantidadePedidos,
            totalVendido,
            ticketMedio: quantidadePedidos > 0 ? totalVendido / quantidadePedidos : 0,
        };
    }

    private obterItem(pedido: Pedido, codigoProduto: number): ItemPedido {
        const item = pedido.buscarItem(codigoProduto);
        if (item === undefined) {
            throw new Error(
                `O produto ${codigoProduto} não está no pedido ${pedido.numero}.`
            );
        }
        return item;
    }
}
