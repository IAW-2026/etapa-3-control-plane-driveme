# Resumen de Integración: Feedback App y Control Plane

Este documento resume los problemas detectados en la arquitectura Máquina a Máquina (M2M) de la **Feedback App**, los cambios que se realizaron en el código basándonos en los lineamientos del equipo (documentados en `martu-rider.md` y `martu-control-plane.md`), y los pasos finales que quedan por hacer para que la integración sea exitosa.

---

## 1. Contexto del Problema

Inicialmente, el Control Plane no lograba conectarse a la API de Feedback para consultar y gestionar comentarios/reportes. Analizando el código y los documentos de arquitectura del sistema, identificamos dos grandes bloqueos:

1. **Problema con el Middleware de Clerk:**
   El bloqueador de Clerk tenía una configuración en las rutas públicas (`api/(.*)`) que omitía la barra inicial, lo cual generaba problemas con Next.js y provocaba que las llamadas entrantes rebotaran contra la autenticación de usuarios. Adicionalmente, el archivo se llama `proxy.ts`, lo cual hace que Next.js lo ignore por completo. Por petición tuya, mantuvimos el nombre `proxy.ts` para evitar un error interno que estabas experimentando, lo cual significa que las rutas de la API ya no sufren interferencia por parte de Clerk y están listas para validar por M2M.

2. **Error Arquitectónico en la Validación de Llaves (M2M):**
   Según la regla del ecosistema de *DriveMe* (descrita en el contexto de la Rider App), **cada app es responsable de validar su propia llave a la entrada**, y debe usar las llaves de los demás a la salida.
   - **Antes:** Tu app esperaba recibir la llave del Control Plane (`CONTROL_PLANE_SECRET`), de Driver o de Rider cuando estas la llamaban. Al llamar a otras apps, Feedback enviaba su propia llave.
   - **El Cambio:** Ahora, **todos** los endpoints de tu API validan tu llave (`FEEDBACK_SERVICE_SECRET`). Y cuando tu app necesita notificar a Rider o Driver sobre nuevas calificaciones, envía en el header `RIDER_SERVICE_SECRET` o `DRIVER_SERVICE_SECRET` respectivamente.

---

## 2. Lo que se Modificó en el Código

Se actualizaron los siguientes endpoints de la carpeta `app/api/` para que la propiedad `x-api-key` recibida deba coincidir siempre con `process.env.FEEDBACK_SERVICE_SECRET`:

- **Control Plane y Analytics:**
  - `GET /api/admin/comentarios`
  - `PATCH /api/admin/comentarios/[id]`
  - `GET /api/admin/reportes`
  - `PATCH /api/admin/reportes/[id]`
  - `GET /api/stats`
- **Rider y Driver App:**
  - `POST /api/resenas`
  - `POST /api/reportes`
  - `GET /api/usuarios/[id]/calificaciones`

*(Nota: el Frontend administrativo local de tu app no se vio afectado, ya que consulta directamente a la base de datos usando Prisma y valida sesión mediante `currentUser()` de Clerk).*

---

## 3. ¿Qué tenés que tener en cuenta para que ande el Control Plane?

Para finalizar la integración y que el Control Plane comience a recibir datos, deberás seguir este checklist:

- [ ] **Desplegar los Cambios:** Haz `git commit` y `git push` de todo este código para que se refleje en Vercel. Los cambios locales no solucionan el problema en producción.
- [ ] **Configurar tu Llave en Vercel:** Asegúrate de tener cargada la variable `FEEDBACK_SERVICE_SECRET` en el dashboard de Vercel de tu proyecto.
- [ ] **Compartir tu Llave:** Pásale por privado ese `FEEDBACK_SERVICE_SECRET` a tus compañeros del **Control Plane** y del **Analytics Dashboard**. Ellos deben mandar exactamente ese valor en el header `x-api-key`.
- [ ] **Compartir tu URL:** Asegúrate de pasarles tu URL de producción (ej. `https://proyecto-a-feedback-driveme.vercel.app`) y recuérdales que no debe llevar una barra `/` al final en sus archivos `.env`.
- [ ] **Pedir las Llaves de tus Compañeros:** Para que la creación de Reseñas funcione, pide y configura en tu Vercel las variables `DRIVER_SERVICE_SECRET`, `RIDER_SERVICE_SECRET`, `DRIVER_APP_URL` y `RIDER_APP_URL`.
