// Não é entidade: apenas a estrutura de dados produzida pelo sistema.
export interface ResumoVendas {
    readonly quantidadePedidos: number;
    readonly totalVendido: number;
    readonly ticketMedio: number;
}
