# Trabajo práctico 07 - Persistencia inicial de reservas de salas

## 1. Punto de partida

Este proyecto es una copia de la refactorización modular realizada en el Trabajo Práctico 06 (`tp-06-salas-modular`). El nombre actual del repositorio es `tp-07-salas-mongodb`.

## 2. Entorno y Versiones

- Se utiliza MongoDB Atlas con un clúster gratuito Free (M0).
- Dependencias principales: Mongoose, Express, Morgan, EJS.

## 3. Instalación y Ejecución

1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar las dependencias.
3. Copiar el archivo `.env.example` y renombrarlo a `.env`. Completar allí la variable `MONGODB_URI` con las credenciales correspondientes a un clúster Free de Atlas.
4. Asegurarse de que la IP local esté permitida en el Network Access de Atlas.
5. Ejecutar los programas de consola o arrancar el servidor web.

**Comandos disponibles:**

- Iniciar sitio web: `npm start`
- Comprobar conexión BD: `node --env-file=.env scripts/comprobar-conexion.js`
- Crear reserva en BD: `node --env-file=.env scripts/crear-reserva.js`
- Listar reservas de BD: `node --env-file=.env scripts/listar-reservas.js`
- Formateo y revisión de código: `npm run format` y `npm run check`.

## 4. Diagnóstico DNS y Resolución

En el archivo de conexión (`src/config/base-datos.js`), se importó `node:dns` y se configuraron los resolutores autorizados públicos (Google y Cloudflare) mediante `dns.setServers(["8.8.8.8", "1.1.1.1"])` para evitar problemas de resolución (ENOTFOUND) con registros SRV/TXT al conectar con Atlas.

## 5. Estructura y Modelo

- **`src/config/entorno.js`**: Procesa las variables de entorno.
- **`src/config/base-datos.js`**: Configura DNS y la conexión a Mongoose.
- **`src/modelos/reserva.js`**: Define el esquema de Mongoose asociado a la colección `reservas` en la base de datos `reservas_salas_u7`.
- **`scripts/`**: Contiene programas Node.js independientes para probar la persistencia (conexión, creación y consulta).

## 6. Esquema y Reglas de Dominio

- **estudiante**: String, obligatorio, sin espacios en los extremos (`trim`).
- **email**: String, obligatorio, incluye validación de presencia de "@" con RegEx (`match`).
- **sala**: String, obligatorio, opciones limitadas (`enum`: Norte, Sur, Multimedia).
- **fecha**: String, obligatorio, rechaza cadenas vacías tras `trim`.
- **turno**: String, obligatorio, opciones limitadas (`enum`: Mañana, Tarde, Noche).
- **personas**: Number, obligatorio, rango 1-6, validado para que sea número entero.

_Nota: Actualmente no se validan cruces de fechas, solapamientos ni cupos._

## 7. Matriz de Pruebas

| Caso                                                 | Resultado Esperado                     | Resultado Observado                     |
| :--------------------------------------------------- | :------------------------------------- | :-------------------------------------- |
| Conexión válida                                      | Confirmación y fin de proceso          | Mensaje "Conexión establecida"          |
| Fallo DNS                                            | Registro del error ENOTFOUND           | Solucionado inyectando DNS de Google    |
| Variable vacía o contraseña errónea                  | Fallo de configuración o autenticación | Error atrapado correctamente sin éxito  |
| Reserva válida                                       | Guarda y devuelve el `_id`             | Documento creado (Ej: `_id: 6acc47...`) |
| Consulta desde proceso nuevo                         | Recupera el mismo `_id`                | `_id` listado exitosamente, cantidad: 1 |
| Segunda consulta                                     | No agrega registros extra              | Mantiene cantidad en 1                  |
| Campos inválidos (ej. personas fraccionarias, sin @) | Rechazo por Mongoose                   | Error de validación, no se guarda en BD |

## 8. Continuidad del sitio en memoria

El servicio web (`npm start`) sigue operando temporalmente sobre un arreglo en memoria. Se trasladó la lectura del puerto a `src/config/entorno.js`, pero Express aún no usa las funciones de Mongoose. El ID de MongoDB (`_id`) solo se crea cuando se impacta la base, por lo que separar temporalmente ambas cosas nos permite validar la persistencia real. La integración final al sitio web se realizará en el TP 08.

## 9. Seguridad

Se confirma que los archivos `.env`, la carpeta `node_modules` y cualquier otra credencial privada se encuentran listados en el `.gitignore` y **no** han sido subidos a este repositorio público.
