const roteador = require("express").Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");
const Produto = require("./Produto");

roteador.get("/", async (request, response) => {
    const produto = await Tabela.listar(request.params.idFornecedor);
    response.send(
        JSON.stringify(produto)
    )
});

roteador.post("/", async (request, response, next) => {
    try {
        const idFornecedor = request.params.idFornecedor;
        const corpo = request.body;
        const dados = Object.assign({}, corpo, { fornecedor: idFornecedor });
        const produto = new Produto(dados);
        await produto.criar();
        response.status(201);
        response.send(produto);
    } catch (erro) {
        next(erro);
    }
});

roteador.delete("/:id", async (request, response) => {
    const dados = {
        id: request.params.id,
        fornecedor: request.params.idFornecedor
    }
    const produto = new Produto(dados);
    await produto.apagar();
    response.status(204);
    response.send(produto);
});

module.exports = roteador;