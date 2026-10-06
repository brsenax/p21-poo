# Diagrama de classes - P23 (Repositories e persistência em memória)

```mermaid
classDiagram
    direction TB

    class Cliente {
        +nome: string
        +Cliente(nome: string)
    }

    class Produto {
        -id: number
        -nome: string
        -preco: number
        +Produto(id: number, nome: string, preco: number)
        +get id() number
        +get nome() string
        +get preco() number
        +set preco(novoPreco: number) void
        -validarPreco(preco: number) void
        +toString() string
    }

    class ItemPedido {
        +produto: Produto
        -quantidade: number
        +ItemPedido(produto: Produto, quantidade: number)
        +get quantidade() number
        +set quantidade(novaQuantidade: number) void
        +calcularSubtotal() number
        -validarQuantidade(qtd: number) void
        +toString() string
    }

    class ItemPedidoPromocional {
        -desconto: number
        +ItemPedidoPromocional(produto, quantidade, desconto?)
        +calcularSubtotal() number
        +toString() string
    }

    class Pedido {
        +numero: number
        +cliente: Cliente
        -itens: ItemPedido[]
        -situacao: SituacaoPedido
        +Pedido(numero: number, cliente: Cliente)
        +get situacao() SituacaoPedido
        +get itens() ItemPedido[]
        +buscarItem(codigoProduto: number) ItemPedido
        -validarPedidoAberto() void
        +adicionarItem(item: ItemPedido) void
        +removerItem(item: ItemPedido) void
        +alterarQuantidade(item: ItemPedido, novaQuantidade: number) void
        +finalizar() void
        +cancelar() void
        +calcularTotal() number
    }

    class SituacaoPedido {
        <<type>>
        ABERTO
        FINALIZADO
        CANCELADO
    }

    class ResumoVendas {
        <<interface>>
        +quantidadePedidos: number
        +totalVendido: number
        +ticketMedio: number
    }

    class ProdutoRepository {
        -produtos: Produto[]
        +salvar(produto: Produto) void
        +buscarPorId(id: number) Produto
        +listar() Produto[]
    }

    class PedidoRepository {
        -pedidos: Pedido[]
        -ultimoNumero: number
        +proximoNumero() number
        +salvar(pedido: Pedido) void
        +buscarPorNumero(numero: number) Pedido
        +buscarPorSituacao(situacao: SituacaoPedido) Pedido[]
        +listar() Pedido[]
    }

    class PedidoService {
        -produtoRepository: ProdutoRepository
        -pedidoRepository: PedidoRepository
        +PedidoService(produtoRepository, pedidoRepository)
        +cadastrarProduto(codigo, nome, preco) Produto
        +listarCardapio() Produto[]
        +consultarProduto(codigo: number) Produto
        +criarPedido(cliente: Cliente) Pedido
        +consultarPedido(numero: number) Pedido
        +adicionarProduto(numeroPedido, codigoProduto, quantidade) void
        +removerProduto(numeroPedido, codigoProduto) void
        +alterarQuantidade(numeroPedido, codigoProduto, novaQuantidade) void
        +finalizarPedido(numeroPedido: number) void
        +cancelarPedido(numeroPedido: number) void
        +listarPedidosPorSituacao(situacao: SituacaoPedido) Pedido[]
        +resumirVendas() ResumoVendas
        -obterItem(pedido, codigoProduto) ItemPedido
    }

    Pedido "0..*" --> "1" Cliente
    Pedido "1" *-- "0..*" ItemPedido
    ItemPedido "0..*" --> "1" Produto
    ItemPedidoPromocional --|> ItemPedido
    Pedido --> SituacaoPedido

    ProdutoRepository "1" o-- "0..*" Produto : armazena
    PedidoRepository "1" o-- "0..*" Pedido : armazena

    PedidoService --> ProdutoRepository
    PedidoService --> PedidoRepository
    PedidoService ..> Pedido : coordena
    PedidoService ..> Produto : cria
    PedidoService ..> ItemPedido : cria
    PedidoService ..> ResumoVendas : produz
```

## Distribuição de responsabilidades

| Camada | Classe | Responsabilidade |
|---|---|---|
| Entidade | `Pedido` | Regras de situação (só altera se ABERTO), total, localizar o próprio item por código de produto |
| Entidade | `ItemPedido` | Valida quantidade, calcula subtotal |
| Entidade | `Produto` | Valida preço |
| Repository | `ProdutoRepository` | Guarda e localiza produtos (coleção privada) |
| Repository | `PedidoRepository` | Guarda e localiza pedidos, gera o número sequencial (coleção privada) |
| Service | `PedidoService` | Coordena cada história: busca via repositories, rejeita código inexistente/duplicado, delega regras às entidades, monta o `ResumoVendas` |

Regra de código duplicado (HU06) e de pedido/produto inexistente (HU08) ficam no Service, não no Repository, que apenas armazena e localiza.
