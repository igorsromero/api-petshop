const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor = require("../../Serializador").SerializadorFornecedor;

roteador.get("/", async (require, response) => {
    const resultados = await TabelaFornecedor.listar();
    response.status(200);
    const serializador = new SerializadorFornecedor(
        response.getHeader("Content-Type"),
        ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
    )
    response.send(serializador.serializar(resultados));
});

roteador.post("/", async (require, response, next) => {
    try {
        const dadosRecebidos = require.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        response.status(201);
        const serializador = new SerializadorFornecedor(
            response.getHeader("Content-Type")
        )
        response.send(serializador.serializar(fornecedor));
    } catch (erro) {
        next(erro);
    }
});

roteador.get("/:idFornecedor", async (request, response, next) => {
    try {
        const id = request.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        response.status(200);
        const serializador = new SerializadorFornecedor(
            response.getHeader("Content-Type")
        )
        response.send(serializador.serializar(fornecedor))
    } catch (erro) {
        next(erro);
    }
});

roteador.put("/:idFornecedor", async (request, response, next) => {
    try {
        const id = request.params.idFornecedor;
        const dadosRecebidos = request.body;
        const dados = Object.assign({}, dadosRecebidos, { id: id });
        const fornecedor = new Fornecedor(dados);
        await fornecedor.atualizar();
        response.status(204);
        response.end();
    } catch (erro) {
        next(erro);
    }
})

roteador.delete("/:idFornecedor", async (request, response, next) => {
    try {
        const id = request.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        await fornecedor.remover();
        response.status(204);
        response.end();
    } catch (erro) {
        next(erro);
    }
});

module.exports = roteador;