import { Produto } from "../entities/produto.js";

export class ProdutoRepository {

    private produtos: Produto[] = [];

    public salvar(produto: Produto): void {
        this.produtos.push(produto)
    }

    public buscarPorId(id: number): Produto | undefined {
        return this.produtos.find(
            produto => produto.id === id 
        );
    }
}