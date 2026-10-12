function crearControladorReservas(servicio) {
  return {
    listar: (req, res) => {
      const reservas = servicio.obtenerTodas();
      res.render("reservas/lista", { titulo: "Listado de Reservas", reservas });
    },
    mostrarFormulario: (req, res) => {
      res.render("reservas/nueva", {
        titulo: "Nueva Reserva",
        error: null,
        valores: {},
      });
    },
    mostrarDetalle: (req, res) => {
      const id = Number(req.params.id);
      const reserva = servicio.obtenerPorId(id);

      if (!reserva) {
        return res.status(404).render("no-encontrado", {
          titulo: "Reserva no encontrada",
          mensaje: "La reserva solicitada no existe.",
        });
      }
      res.render("reservas/detalle", {
        titulo: `Reserva #${reserva.id}`,
        reserva,
      });
    },
    crear: (req, res) => {
      servicio.crear(req.reservaValidada);
      res.redirect("/reservas");
    },
  };
}

module.exports = { crearControladorReservas };
