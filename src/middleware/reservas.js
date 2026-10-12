const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  let { estudiante, email, sala, fecha, turno, personas } = req.body;

  // Normalización
  estudiante = estudiante ? estudiante.trim() : "";
  email = email ? email.trim() : "";
  const personasNum = Number(personas);
  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  // Comprobaciones
  if (
    !estudiante ||
    !email ||
    !sala ||
    !fecha ||
    !turno ||
    !personas ||
    !salasPermitidas.includes(sala) ||
    !turnosPermitidos.includes(turno) ||
    isNaN(personasNum) ||
    personasNum < 1 ||
    personasNum > 6 ||
    !email.includes("@")
  ) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva Reserva",
      error:
        'Por favor completa todos los campos correctamente. Verifica que la sala y turno sean válidos, el email contenga "@" y las personas sean entre 1 y 6.',
      valores: req.body,
    });
  }

  // Éxito: Preparar datos
  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasNum,
  };
  next();
}

module.exports = { prepararAreaReservas, validarReserva };
