function crearServicioReservas(datosIniciales) {
  // Clonamos los datos para proteger la semilla original
  const reservas = [...datosIniciales];

  return {
    obtenerTodas: () => reservas,

    obtenerPorId: (id) => reservas.find((r) => r.id === id),

    contar: () => reservas.length,

    crear: (reservaValidada) => {
      const ultimoId =
        reservas.length > 0 ? reservas[reservas.length - 1].id : 0;
      const nuevaReserva = {
        id: ultimoId + 1,
        ...reservaValidada,
      };
      reservas.push(nuevaReserva);
      return nuevaReserva;
    },
  };
}

module.exports = { crearServicioReservas };
