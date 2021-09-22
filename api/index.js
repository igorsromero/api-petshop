const express = require("express");
const config = require("config");
const NaoEncontrado = require("./erros/NaoEncontrado");
const CampoInvalido = require("./erros/CampoInvalido");
const DadosNaoFornecidos = require("./erros/DadosNaoFornecidos");
const ValorNaoSuportado = require("./erros/ValorNaoSuportado");
const formatosAceitos = require("./Serializador").formatosAceitos;
const SerializadorErro = require("./Serializador").SerializadorErro;

const app = express();

app.use(express.json());

app.use((request, response, next) => {
    let formatoRequisitado = request.header("Accept");

    if (formatoRequisitado === "*/*") {
        formatoRequisitado = "application/json";
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        response.sendStatus(406);
        return response.end();
    }

    response.setHeader("Content-Type", formatoRequisitado);
    next();
});

app.use((request, response, next) => {
    response.set("Access-Control-Allow-Origin", "*");
    next();
});

const roteador = require("./rotas/fornecedores");
app.use("/api/fornecedores", roteador);

const roteadorV2 = require("./rotas/fornecedores/rotas.v2");
app.use("/api/v2/fornecedores", roteadorV2);

app.use((erro, request, response, next) => {
    let status = 500;

    if (erro instanceof NaoEncontrado) {
        status = 404;
    }

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400;
    }

    if (erro instanceof ValorNaoSuportado) {
        status = 406;
    }

    const serializador = new SerializadorErro(
        response.getHeader("Content-Type")
    );

    response.status(status);
    response.send(serializador.serializar({
        mensagem: erro.message,
        id: erro.idErro
    }));
})

app.listen(config.get("api.porta"), () => console.log("A API está funcionando!"));