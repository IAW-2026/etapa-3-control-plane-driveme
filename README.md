[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Fu6E-LL6)

# DriveMe — Control Plane

Panel de administración interno de DriveMe. Permite gestionar conductores, pasajeros, viajes, transacciones, billeteras, solicitudes, feedback y el banco central de la plataforma.

**Deploy:** https://etapa-3-control-plane-driveme.vercel.app/

---

## Acceso

El panel es de uso exclusivo para administradores. El login se realiza con Clerk.

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin+clerk_test@iaw.com` | `iawuser#` |

> Las cuentas sin rol `admin` asignado en Clerk verán una pantalla de acceso denegado.

---

## Configuración local

```bash
cp .env.local.example .env.local
# Completar las variables con tus propios valores
npm install
npm run dev
```

Ver [.env.local.example](.env.local.example) para las variables requeridas.
