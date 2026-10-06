import type { Produto } from "../entities/produto.js";

export class ProdutoRepository {
    private readonly produtos: Produto[] = [];

    public salvar(produto: Produto): void {
        this.produtos.push(produto);
    }

    public buscarPorId(id: number): Produto | undefined {
        return this.produtos.find(produto => produto.id === id);
    }

    // devolve uma cópia: a coleção interna não é exposta
    public listar(): Produto[] {
        return [...this.produtos];
    }
}
