const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const SerializadorFornecedor = require("../../Serializador").SerializadorFornecedor;

roteador.options("/", (request, response) => {
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-hEADERS", "Content-Type");
    response.status(204);
    response.end();
});

roteador.get("/", async (require, response) => {
    const resultados = await TabelaFornecedor.listar();
    response.status(200);
    const serializador = new SerializadorFornecedor(
        response.getHeader("Content-Type")
    )
    response.send(serializador.serializar(resultados));
});

module.exports = roteador;