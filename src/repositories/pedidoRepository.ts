import type { Pedido, SituacaoPedido } from "../entities/pedido.js";

export class PedidoRepository {
    private readonly pedidos: Pedido[] = [];
    private ultimoNumero = 0;

    // numeração única e sequencial, começando em 1
    public proximoNumero(): number {
        this.ultimoNumero += 1;
        return this.ultimoNumero;
    }

    public salvar(pedido: Pedido): void {
        this.pedidos.push(pedido);
    }

    public buscarPorNumero(numero: number): Pedido | undefined {
        return this.pedidos.find(pedido => pedido.numero === numero);
    }

    public buscarPorSituacao(situacao: SituacaoPedido): Pedido[] {
        return this.pedidos.filter(pedido => pedido.situacao === situacao);
    }

    public listar(): Pedido[] {
        return [...this.pedidos];
    }
}
