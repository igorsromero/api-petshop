const roteador = require("express").Router({ mergeParams: true });
const Tabela = require("./TabelaProduto");

roteador.get("/", async (request, response) => {
    const produto = await Tabela.listar(request.params.idFornecedor);
    response.send(
        JSON.stringify([])
    )
});

module.exports = roteador;