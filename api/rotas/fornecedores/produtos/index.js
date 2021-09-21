const roteador = require("express").Router();

roteador.get("/", (request, response) => {
    response.send(
        JSON.stringify([])
    )
});

module.exports = roteador;