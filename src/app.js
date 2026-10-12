const express = require("express");
const path = require("node:path");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes.js");
const { crearControladorReservas } = require("./controladores/reservas.js");
const { crearRouterReservas } = require("./rutas/reservas.js");

function crearApp(servicio, entorno) {
  const app = express();

  // 1. Morgan (Dependiendo del entorno de configuracion)
  const formatoMorgan = entorno === "production" ? "combined" : "dev";
  app.use(morgan(formatoMorgan));

  // 2. Identificador de solicitud
  app.use(identificarSolicitud);

  // 3. Medición de duración hasta finish
  app.use(medirDuracion);

  // 4. Configuración de EJS y Layouts
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  // 5. Recursos estáticos y Parsers
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // --- RUTAS GLOBALES ---
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Inicio - Reserva de Salas" });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  // --- MONTAJE DE ROUTER ---
  const controlador = crearControladorReservas(servicio);
  const routerReservas = crearRouterReservas(controlador);
  app.use("/reservas", routerReservas);

  // --- PÁGINA 404 (Middleware Final) ---
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = { crearApp };
