import { Produto } from "../entities/produto.js";
import { ItemPedido } from "../entities/itemPedido.js";
import { ItemPedidoPromocional } from "../entities/itemPedidoPromocional.js";

try {
    const p1 = new Produto(1, "Notebook", 4000.00);
    const p2 = new Produto(2, "Mouse", 100.00);
    const itemRegular = new ItemPedido(p1, 2);
//7
    console.log(itemRegular.toString());
// Criando item promocional omitindo o desconto opcional (assume 10%)
    const itemPromo1 = new ItemPedidoPromocional(p2, 2);
    console.log(itemPromo1.toString());
// Criando item promocional informando desconto de 20%
    const itemPromo2 = new ItemPedidoPromocional(p2, 5, 0.20);
    console.log(itemPromo2.toString());
} catch (error: unknown) { //8
//9
    if (error instanceof Error) {
        console.error(`Erro validado: ${error.message}`);
    } else {
        console.error("Ocorreu um erro inesperado e desconhecido.");
    }
}