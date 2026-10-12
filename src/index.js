const { cargarConfiguracion } = require("./config/entorno.js");
const { crearServicioReservas } = require("./servicios/reservas.js");
const { crearApp } = require("./app.js");

// Datos semilla para la aplicación web en memoria
const reservasIniciales = [
  {
    id: 1,
    estudiante: "Ana López",
    email: "ana@mail.com",
    sala: "Sala Norte",
    fecha: "2026-10-15",
    turno: "Mañana",
    personas: 3,
  },
  {
    id: 2,
    estudiante: "Carlos Ruiz",
    email: "carlos@mail.com",
    sala: "Sala Sur",
    fecha: "2026-10-16",
    turno: "Tarde",
    personas: 5,
  },
  {
    id: 3,
    estudiante: "María Gómez",
    email: "maria@mail.com",
    sala: "Sala Multimedia",
    fecha: "2026-10-17",
    turno: "Noche",
    personas: 2,
  },
  {
    id: 4,
    estudiante: "Juan Pérez",
    email: "juan@mail.com",
    sala: "Sala Norte",
    fecha: "2026-10-18",
    turno: "Mañana",
    personas: 1,
  },
];

function iniciarServidor() {
  try {
    // 1. Cargar configuración de variables de entorno
    const config = cargarConfiguracion();

    // 2. Instanciar la lógica de negocio (Servicio en memoria para la web)
    const servicio = crearServicioReservas(reservasIniciales);

    // 3. Crear el servidor Express y pasarle las dependencias
    const app = crearApp(servicio, config.entorno);

    // 4. Escuchar en el puerto configurado
    app.listen(config.puerto, () => {
      console.log(
        `Servidor web iniciado en http://localhost:${config.puerto} (Entorno: ${config.entorno})`,
      );
    });
  } catch (error) {
    console.error("Error crítico al iniciar el servidor web:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
