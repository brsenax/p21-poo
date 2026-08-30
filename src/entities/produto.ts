export class Produto {
    private readonly _id: number;
    private _nome: string;
    private _preco: number;

    constructor(id: number, nome: string, preco: number) {
        this.validarPreco(preco);
        this._id = id;
        this._nome = nome;
        this._preco = preco;
    }

    public get id(): number { 
        return this._id; 
    }

    public get nome(): string { 
        return this._nome; 
    }

    public get preco(): number { 
        return this._preco; 
    }

    public set preco(novoPreco: number) {
        this.validarPreco(novoPreco);
        this._preco = novoPreco;
    }

    private validarPreco(preco: number): void {
        if (preco < 0) {
            throw new Error("O preço do produto não pode ser negativo.");
        }
    }

    public toString(): string {
        return `Produto #${this._id}: ${this._nome}`;
    }
}