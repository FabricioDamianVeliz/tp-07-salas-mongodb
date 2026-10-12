const express = require("express");
const {
  prepararAreaReservas,
  validarReserva,
} = require("../middleware/reservas.js");

function crearRouterReservas(controlador) {
  const router = express.Router();

  // 1. Middleware de área para todas las rutas de reservas
  router.use(prepararAreaReservas);

  // 2. Rutas relativas
  router.get("/", controlador.listar);

  // /nueva va ANTES de /:id
  router.get("/nueva", controlador.mostrarFormulario);
  router.get("/:id", controlador.mostrarDetalle);

  router.post("/", validarReserva, controlador.crear);

  return router;
}

module.exports = { crearRouterReservas };
