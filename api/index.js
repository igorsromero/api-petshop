const express = require("express");
const config = require("config");
const NaoEncontrado = require("./erros/NaoEncontrado");
const roteador = require("./rotas/fornecedores");
const CampoInvalido = require("./erros/CampoInvalido");
const DadosNaoFornecidos = require("./erros/DadosNaoFornecidos");

const app = express();

app.use(express.json());

app.use("/api/fornecedores", roteador);

app.use((erro, request, response, next) => {
    let status = 500;

    if (erro instanceof NaoEncontrado) {
        status = 404;
    }

    if (erro instanceof CampoInvalido || erro instanceof DadosNaoFornecidos) {
        status = 400;
    }

    response.sendStatus(status);
    response.send(JSON.stringify({
        mensagem: erro.message,
        id: erro.idErro
    }));
})

app.listen(config.get("api.porta"), () => console.log("A API está funcionando!"));