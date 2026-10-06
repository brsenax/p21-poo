import { Cliente } from "./entities/cliente.js";
import type { SituacaoPedido } from "./entities/pedido.js";
import { PedidoService } from "./services/pedidoService.js";
import { ProdutoRepository } from "./repositories/produtoRepository.js";
import { PedidoRepository } from "./repositories/pedidoRepository.js";

// ---------------------- utilitários de apresentação ----------------------

const moeda = (valor: number): string => `R$ ${valor.toFixed(2).replace(".", ",")}`;

function titulo(texto: string): void {
    console.log(`\n=====================================================`);
    console.log(texto);
    console.log(`=====================================================`);
}

// Executa uma operação do Service e mostra se foi permitida ou rejeitada.
function tentar(descricao: string, operacao: () => void): void {
    try {
        operacao();
        console.log(`  [PERMITIDO] ${descricao}`);
    } catch (e: unknown) {
        const motivo = e instanceof Error ? e.message : "erro desconhecido";
        console.log(`  [REJEITADO] ${descricao} -> ${motivo}`);
    }
}

// Configuração dos componentes: cada demonstração recebe repositories novos.
function configurarComponentes(): PedidoService {
    return new PedidoService(new ProdutoRepository(), new PedidoRepository());
}

function cadastrarCardapio(service: PedidoService): void {
    service.cadastrarProduto(1, "Café", 5.0);
    service.cadastrarProduto(2, "Bolo", 8.0);
    service.cadastrarProduto(3, "Suco", 6.0);
    service.cadastrarProduto(4, "Sanduíche", 15.0);
}

function apresentarPedido(service: PedidoService, numero: number): void {
    const pedido = service.consultarPedido(numero);
    console.log(`  Pedido ${pedido.numero} - ${pedido.cliente.nome} (${pedido.situacao})`);
    pedido.itens.forEach(item => console.log(`    ${item.toString()}`));
    console.log(`  Total do pedido: ${moeda(pedido.calcularTotal())}`);
}

// Movimento usado em HU09 e HU10 (produzido apenas via operações do Service)
function registrarMovimento(service: PedidoService): void {
    const ana = service.criarPedido(new Cliente("Ana"));
    service.adicionarProduto(ana.numero, 1, 1);
    service.adicionarProduto(ana.numero, 2, 1);
    service.finalizarPedido(ana.numero);

    const bruno = service.criarPedido(new Cliente("Bruno"));
    service.adicionarProduto(bruno.numero, 3, 2);

    const carla = service.criarPedido(new Cliente("Carla"));
    service.adicionarProduto(carla.numero, 4, 1);
    service.cancelarPedido(carla.numero);

    const diego = service.criarPedido(new Cliente("Diego"));
    service.adicionarProduto(diego.numero, 1, 2);
    service.adicionarProduto(diego.numero, 4, 1);
    service.finalizarPedido(diego.numero);
}

function apresentarResumo(service: PedidoService): void {
    const resumo = service.resumirVendas();
    console.log(`  Pedidos vendidos: ${resumo.quantidadePedidos}`);
    console.log(`  Total vendido: ${moeda(resumo.totalVendido)}`);
    console.log(`  Ticket médio: ${moeda(resumo.ticketMedio)}`);
}

// =====================================================
// HU01 - Criar pedido e adicionar produtos
// =====================================================
{
    titulo("HU01 - Criar pedido e adicionar produtos");
    // configuração dos componentes
    const service = configurarComponentes();
    // preparação dos dados
    cadastrarCardapio(service);
    // execução da história
    const pedido = service.criarPedido(new Cliente("João"));
    tentar("adicionar 1 Café", () => service.adicionarProduto(pedido.numero, 1, 1));
    tentar("adicionar 1 Bolo", () => service.adicionarProduto(pedido.numero, 2, 1));
    tentar("adicionar 1 Suco", () => service.adicionarProduto(pedido.numero, 3, 1));
    // apresentação dos resultados (esperado: R$ 19,00)
    apresentarPedido(service, pedido.numero);
}

// =====================================================
// HU02 - Remover produto do pedido
// =====================================================
{
    titulo("HU02 - Remover produto do pedido");
    const service = configurarComponentes();
    cadastrarCardapio(service);
    const pedido = service.criarPedido(new Cliente("João"));
    service.adicionarProduto(pedido.numero, 1, 1);
    service.adicionarProduto(pedido.numero, 2, 1);
    service.adicionarProduto(pedido.numero, 3, 1);

    tentar("remover Bolo (2)", () => service.removerProduto(pedido.numero, 2));
    tentar("remover Sanduíche (4), que não está no pedido", () =>
        service.removerProduto(pedido.numero, 4));
    // esperado: R$ 11,00
    apresentarPedido(service, pedido.numero);
}

// =====================================================
// HU03 - Alterar quantidade de um produto
// =====================================================
{
    titulo("HU03 - Alterar quantidade de um produto");
    const service = configurarComponentes();
    cadastrarCardapio(service);
    const pedido = service.criarPedido(new Cliente("João"));
    service.adicionarProduto(pedido.numero, 1, 1);
    service.adicionarProduto(pedido.numero, 3, 1);

    tentar("alterar Suco para 3", () => service.alterarQuantidade(pedido.numero, 3, 3));
    tentar("alterar Suco para 0", () => service.alterarQuantidade(pedido.numero, 3, 0));
    tentar("alterar Suco para -2", () => service.alterarQuantidade(pedido.numero, 3, -2));
    // esperado: R$ 23,00
    apresentarPedido(service, pedido.numero);
}

// =====================================================
// HU04 - Finalizar pedido
// =====================================================
{
    titulo("HU04 - Finalizar pedido");
    const service = configurarComponentes();
    cadastrarCardapio(service);
    const pedido = service.criarPedido(new Cliente("João"));
    service.adicionarProduto(pedido.numero, 1, 1);
    service.adicionarProduto(pedido.numero, 3, 1);

    tentar("finalizar pedido", () => service.finalizarPedido(pedido.numero));
    tentar("adicionar Bolo após finalizar", () => service.adicionarProduto(pedido.numero, 2, 1));
    tentar("remover Café após finalizar", () => service.removerProduto(pedido.numero, 1));
    tentar("alterar quantidade do Suco após finalizar", () =>
        service.alterarQuantidade(pedido.numero, 3, 10));
    apresentarPedido(service, pedido.numero);
}

// =====================================================
// HU05 - Cancelar pedido
// =====================================================
{
    titulo("HU05 - Cancelar pedido");
    const service = configurarComponentes();
    cadastrarCardapio(service);

    const pedido = service.criarPedido(new Cliente("Maria"));
    service.adicionarProduto(pedido.numero, 1, 2);
    service.adicionarProduto(pedido.numero, 3, 1);

    tentar("cancelar pedido", () => service.cancelarPedido(pedido.numero));
    tentar("adicionar Café após cancelar", () => service.adicionarProduto(pedido.numero, 1, 1));
    tentar("finalizar pedido cancelado", () => service.finalizarPedido(pedido.numero));

    const finalizado = service.criarPedido(new Cliente("João"));
    service.adicionarProduto(finalizado.numero, 1, 1);
    service.finalizarPedido(finalizado.numero);
    tentar("cancelar pedido já finalizado", () => service.cancelarPedido(finalizado.numero));

    apresentarPedido(service, pedido.numero);
    apresentarPedido(service, finalizado.numero);
}

// =====================================================
// HU06 - Cadastrar produtos no cardápio
// =====================================================
{
    titulo("HU06 - Cadastrar produtos no cardápio");
    const service = configurarComponentes();
    cadastrarCardapio(service);
    console.log(`  Produtos cadastrados: ${service.listarCardapio().length}`);

    tentar("cadastrar 2 - Torta - R$ 10,00", () => service.cadastrarProduto(2, "Torta", 10.0));

    console.log(`  Produto 2 continua sendo: ${service.consultarProduto(2).nome}`);
    console.log(`  Produtos cadastrados: ${service.listarCardapio().length}`);
}

// =====================================================
// HU07 - Consultar o cardápio
// =====================================================
{
    titulo("HU07 - Consultar o cardápio");
    const service = configurarComponentes();
    cadastrarCardapio(service);

    console.log("  Cardápio:");
    service.listarCardapio().forEach(p =>
        console.log(`    ${p.id} - ${p.nome} - ${moeda(p.preco)}`));

    tentar("consultar produto 4", () =>
        console.log(`    -> ${service.consultarProduto(4).nome}`));
    tentar("consultar produto 99", () => service.consultarProduto(99));
}

// =====================================================
// HU08 - Registrar pedido usando o cardápio
// =====================================================
{
    titulo("HU08 - Registrar pedido usando o cardápio");
    const service = configurarComponentes();
    cadastrarCardapio(service);

    const pedido = service.criarPedido(new Cliente("Ana"));
    console.log(`  Número do pedido criado: ${pedido.numero}`);

    tentar("adicionar 2 Cafés ao pedido 1", () => service.adicionarProduto(1, 1, 2));
    tentar("adicionar 1 Bolo ao pedido 1", () => service.adicionarProduto(1, 2, 1));
    tentar("adicionar produto 99 ao pedido 1", () => service.adicionarProduto(1, 99, 1));

    apresentarPedido(service, 1); // esperado: R$ 18,00

    tentar("consultar pedido 50", () => service.consultarPedido(50));
    tentar("adicionar Café ao pedido 50", () => service.adicionarProduto(50, 1, 1));
    console.log(`  Pedido 1 após as rejeições: ${moeda(service.consultarPedido(1).calcularTotal())}`);
}

// =====================================================
// HU09 - Acompanhar pedidos por situação
// =====================================================
{
    titulo("HU09 - Acompanhar pedidos por situação");
    const service = configurarComponentes();
    cadastrarCardapio(service);
    registrarMovimento(service);

    const situacoes: SituacaoPedido[] = ["ABERTO", "FINALIZADO", "CANCELADO"];
    situacoes.forEach(situacao => {
        console.log(`  ${situacao}:`);
        service.listarPedidosPorSituacao(situacao).forEach(p =>
            console.log(`    pedido ${p.numero} (${p.cliente.nome}) - ${moeda(p.calcularTotal())}`));
    });
}

// =====================================================
// HU10 - Resumo de vendas
// =====================================================
{
    titulo("HU10 - Resumo de vendas");
    const service = configurarComponentes();
    cadastrarCardapio(service);

    console.log("  1) Sistema sem pedidos:");
    apresentarResumo(service);

    registrarMovimento(service);
    console.log("  2) Após o movimento:");
    apresentarResumo(service);

    service.finalizarPedido(2);
    console.log("  3) Após finalizar o pedido 2 (Bruno):");
    apresentarResumo(service);
}
