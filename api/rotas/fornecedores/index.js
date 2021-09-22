const roteador = require("express").Router();
const TabelaFornecedor = require("./TabelaFornecedor");
const Fornecedor = require("./Fornecedor");
const SerializadorFornecedor = require("../../Serializador").SerializadorFornecedor;

roteador.options("/", (request, response) => {
    response.set("Access-Control-Allow-Methods", "GET, POST");
    response.set("Access-Control-Allow-hEADERS", "Content-Type");
    response.status(204);
    response.end();
});

roteador.get("/", async (require, response) => {
    const resultados = await TabelaFornecedor.listar();
    response.status(200);
    const serializador = new SerializadorFornecedor(
        response.getHeader("Content-Type"),
        ['empresa']
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
            response.getHeader("Content-Type"),
            ['empresa']
        )
        response.send(serializador.serializar(fornecedor));
    } catch (erro) {
        next(erro);
    }
});

roteador.options("/:idFornecedor", (request, response) => {
    response.set("Access-Control-Allow-Methods", "GET, PUT, DELETE");
    response.set("Access-Control-Allow-hEADERS", "Content-Type");
    response.status(204);
    response.end();
});

roteador.get("/:idFornecedor", async (request, response, next) => {
    try {
        const id = request.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        response.status(200);
        const serializador = new SerializadorFornecedor(
            response.getHeader("Content-Type")
            ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao']
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

const roteadorProdutos = require("./produtos");

const verificarFornecedor = async (request, response, next) => {
    try {
        const id = request.params.idFornecedor;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        request.fornecedor = fornecedor;
        next();
    } catch (erro) {
        next(erro);
    }
};

roteador.use("/:idFornecedor/produtos", verificarFornecedor, roteadorProdutos);

module.exports = roteador;