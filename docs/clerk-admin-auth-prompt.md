# Prompt: Integrar Clerk con autenticación por rol admin en Next.js 16

Usá este documento como prompt para que Claude implemente Clerk en cualquier Next.js 16 app con restricción de acceso por rol.

---

## Contexto para el asistente

Necesito integrar Clerk como sistema de autenticación en una app Next.js 16. El acceso debe estar restringido únicamente a usuarios con el rol `admin` en sus `publicMetadata` de Clerk. Los usuarios sin sesión deben ver una landing card con botones de sign-in/sign-up. Los usuarios autenticados sin el rol admin deben ver un card de acceso denegado con su info de usuario y botón para cerrar sesión. El sidebar debe mostrar el `UserButton` de Clerk con info del usuario en el footer.

---

## Requisitos de la implementación

### Stack y restricciones importantes

- **Framework:** Next.js 16
- **Package manager:** pnpm (ajustar si usás npm/yarn)
- **IMPORTANTE — Next.js 16:** el archivo de middleware **no** es `src/middleware.ts` sino `src/proxy.ts`. Esto es específico de Next.js 16 y es crítico: usar `middleware.ts` causa página en blanco.
- Las rutas protegidas deben agruparse en un **Route Group** `(app)` para poder aplicarles un layout con sidebar/shell sin afectar las rutas públicas.

---

## Paso 1 — Instalar dependencias

```bash
pnpm add @clerk/nextjs
```

Versión de referencia: `@clerk/nextjs ^7.5.7`

---

## Paso 2 — Variables de entorno

Agregar al `.env.local` (y al `.env.local.example` para documentar):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

Las keys se obtienen desde el [Clerk Dashboard](https://dashboard.clerk.com) → seleccionar la aplicación → API Keys.

**Importante — Organizations:** al crear una app en Clerk, la feature de Organizations viene habilitada por defecto y agrega un campo de nombre de organización al sign-up. Si no la necesitás (es el caso cuando el sistema de roles usa `publicMetadata`), deshabilitarla desde el Dashboard: Organizations → Disable.

---

## Paso 3 — Reestructurar rutas en un Route Group

Mover **todas** las páginas de la app (excepto la raíz `/`) dentro de `src/app/(app)/`. El route group no afecta las URLs — `/dashboard` sigue siendo `/dashboard`.

```
src/app/dashboard/        →  src/app/(app)/dashboard/
src/app/[cualquier-ruta]/ →  src/app/(app)/[cualquier-ruta]/
```

En PowerShell:

```powershell
$base = "src\app"
$appBase = "$base\(app)"
New-Item -ItemType Directory -Force -Path $appBase
# Repetir por cada directorio de ruta protegida:
Move-Item "$base\dashboard"      "$appBase\dashboard"
Move-Item "$base\[otra-ruta]"    "$appBase\[otra-ruta]"
# Crear directorio para la página de acceso denegado:
New-Item -ItemType Directory -Force -Path "$base\unauthorized"
```

---

## Paso 4 — Middleware → `src/proxy.ts`

Reemplazar completamente el contenido existente del middleware.

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublic = createRouteMatcher(['/', '/unauthorized', '/api/webhooks(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return

  const { userId } = await auth.protect()

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  if ((user.publicMetadata as { role?: string })?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
```

**Flujo:**
1. Rutas públicas (`/`, `/unauthorized`, `/api/webhooks/*`) pasan sin autenticación.
2. Cualquier otra ruta exige sesión activa via `auth.protect()` (Clerk redirige al sign-in si no hay sesión).
3. Se verifica `publicMetadata.role === 'admin'`. Si no cumple, redirige a `/unauthorized`.

---

## Paso 5 — Wrapper de auth → `src/lib/auth.ts`

Archivo nuevo. Centraliza los imports de Clerk para que el resto de la app no importe directo de `@clerk/nextjs/server`.

```ts
// src/lib/auth.ts
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"
export { auth, currentUser, clerkClient }
```

Usar este archivo en server components y route handlers:

```ts
import { auth, clerkClient } from '@/lib/auth'
```

---

## Paso 6 — Root layout → `src/app/layout.tsx`

Envolver la app con `<ClerkProvider>`. Quitar cualquier sidebar/shell del root layout (se moverá al layout del route group). Mantener fuentes, variables CSS y clases de body que ya tenga la app.

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
// Mantener cualquier import de fuente que ya exista

export const metadata: Metadata = {
  title: '[Nombre de la app]',
  description: '[Descripción]',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
          {/* Preconnect hints opcionales para mejorar performance de Clerk */}
          <link rel="preconnect" href="https://scdn.clerk.com" />
          <link rel="preconnect" href="https://segapi.clerk.com" />
        </head>
        <body className="[clases-existentes-de-la-app]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

---

## Paso 7 — Layout del route group → `src/app/(app)/layout.tsx`

Archivo nuevo. Contiene el shell protegido (sidebar, navbar, etc.) que antes estaba en el root layout.

```tsx
// src/app/(app)/layout.tsx
import { Sidebar } from '@/components/Sidebar' // ajustar al componente real

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 pt-20 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
```

---

## Paso 8 — UserButton en el Sidebar

El `Sidebar` es un componente client (`'use client'`), por lo que puede usar hooks de Clerk directamente. Agregar `UserButton` y `useUser` al footer del sidebar para mostrar el usuario logueado.

```tsx
// Al principio del archivo, agregar a los imports existentes:
import { UserButton, useUser } from '@clerk/nextjs'

// Dentro del componente, al inicio:
const { user } = useUser()

// Footer del sidebar — reemplazar el contenido existente:
<div className="px-5 py-4 border-t border-[rgba(220,38,38,0.15)] shrink-0 space-y-3">
  <div className="flex items-center gap-3 min-w-0">
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'w-8 h-8 rounded border border-[rgba(220,38,38,0.3)] shadow-[0_0_10px_rgba(220,38,38,0.1)]',
          userButtonPopoverCard: 'bg-[#0A0A0A] border border-[rgba(220,38,38,0.15)] shadow-[0_0_30px_rgba(220,38,38,0.1)]',
          userButtonPopoverActionButton: 'text-text-muted hover:text-white hover:bg-[#141414]',
          userButtonPopoverActionButtonText: 'text-xs uppercase tracking-widest',
          userButtonPopoverFooter: 'hidden',
        },
      }}
    />
    <div className="flex flex-col min-w-0">
      <span className="text-white text-xs font-bold truncate leading-tight">
        {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? '—'}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-primary/60 leading-tight">Admin</span>
    </div>
  </div>
  <p className="text-[10px] uppercase tracking-widest text-primary/30">[App name] // v1.0</p>
</div>
```

> Adaptar colores al sistema de design de la app destino. Los valores `rgba(220,38,38,...)` son para un sistema con rojo como color primario.

---

## Paso 9 — Homepage → `src/app/page.tsx`

Reemplazar el contenido existente. Usa un card centrado con la estética de la app. Tres estados:

- **No autenticado** → card con botones de sign-in / sign-up
- **Autenticado + rol `admin`** → redirect a `/dashboard`
- **Autenticado + sin rol `admin`** → card con info del usuario, mensaje y botón de cerrar sesión

Los botones tienen efectos de hover con escala y glow para dar feedback táctil.

```tsx
// src/app/page.tsx
import { auth, clerkClient } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Crosshair } from 'lucide-react' // ajustar al ícono de la app

export default async function HomePage() {
  const { userId } = await auth()

  if (userId) {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    if ((user.publicMetadata as { role?: string })?.role === 'admin') {
      redirect('/dashboard')
    }

    const displayName = user.fullName ?? user.emailAddresses[0]?.emailAddress ?? '—'
    const email = user.emailAddresses[0]?.emailAddress

    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface border border-[rgba(220,38,38,0.15)] rounded-sm shadow-[0_0_40px_rgba(220,38,38,0.05)] p-8 flex flex-col items-center gap-6">

          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Crosshair size={20} className="text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-base font-bold text-white uppercase tracking-widest">[Nombre de la app]</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">Acceso restringido</p>
            </div>
          </div>

          <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

          <div className="flex items-center gap-3 w-full">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 rounded border border-[rgba(220,38,38,0.3)] shadow-[0_0_10px_rgba(220,38,38,0.1)]',
                  userButtonPopoverCard: 'bg-surface border border-[rgba(220,38,38,0.15)] shadow-[0_0_30px_rgba(220,38,38,0.1)]',
                  userButtonPopoverActionButton: 'text-text-muted hover:text-white hover:bg-[#141414]',
                  userButtonPopoverActionButtonText: 'text-xs uppercase tracking-widest',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-bold truncate leading-tight">{displayName}</span>
              {email && <span className="text-text-muted text-[10px] truncate leading-tight">{email}</span>}
            </div>
          </div>

          <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

          <div className="flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-text-muted text-sm">Tu cuenta no tiene permisos de administrador.</p>
              <p className="text-text-muted text-xs opacity-60 mt-1">Contactá al equipo para solicitar acceso.</p>
            </div>
            <SignOutButton>
              <button className="px-4 py-2 border border-[rgba(220,38,38,0.3)] hover:border-primary text-text-muted hover:text-white text-xs uppercase tracking-widest transition-all duration-150 rounded-sm w-full hover:bg-[rgba(220,38,38,0.05)] hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:scale-[1.02] active:scale-[0.98]">
                Cerrar sesión
              </button>
            </SignOutButton>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm bg-surface border border-[rgba(220,38,38,0.15)] rounded-sm shadow-[0_0_40px_rgba(220,38,38,0.05)] p-8 flex flex-col items-center gap-6">

        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Crosshair size={20} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-bold text-white uppercase tracking-widest">[Nombre de la app]</h1>
            <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">Panel de administración</p>
          </div>
        </div>

        <div className="w-full h-px bg-[rgba(220,38,38,0.15)]" />

        <div className="flex flex-col gap-3 w-full">
          <SignInButton>
            <button className="w-full px-6 py-2.5 bg-primary hover:bg-primary/80 text-white font-bold rounded-sm text-sm uppercase tracking-widest transition-all duration-150 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02] active:scale-[0.98]">
              Iniciar sesión
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="w-full px-6 py-2.5 border border-[rgba(220,38,38,0.3)] hover:border-primary text-text-muted hover:text-white font-bold rounded-sm text-sm uppercase tracking-widest transition-all duration-150 hover:bg-[rgba(220,38,38,0.05)] hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:scale-[1.02] active:scale-[0.98]">
              Registrarse
            </button>
          </SignUpButton>
        </div>

      </div>
    </div>
  )
}
```

> `bg-surface` es una clase de Tailwind custom del proyecto (equivale a `bg-[#0A0A0A]`). Reemplazar con el color de fondo correspondiente si la app destino no la tiene definida.

---

## Paso 10 — Página de acceso denegado → `src/app/unauthorized/page.tsx`

El middleware redirige aquí cuando el usuario está autenticado pero no tiene rol `admin`. Nota: este estado también puede ocurrir en la homepage — el card de la homepage ya cubre este caso con más detalle (user info + sign out). Esta página es el fallback cuando el middleware intercepta una ruta protegida directamente.

```tsx
// src/app/unauthorized/page.tsx
import Link from 'next/link'
import { Crosshair } from 'lucide-react' // ajustar al ícono de la app

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded border border-primary flex items-center justify-center bg-[rgba(220,38,38,0.05)] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
        <Crosshair size={20} className="text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Acceso denegado</h1>
      <p className="text-text-muted text-sm">No tenés permisos para acceder a esta aplicación.</p>
      <Link href="/" className="text-primary hover:text-primary/80 text-xs transition-colors uppercase tracking-widest">
        Volver al inicio
      </Link>
    </div>
  )
}
```

---

## Paso 11 — Asignar el rol admin a un usuario

### Opción A: Desde el Clerk Dashboard (manual)

1. Ir a [dashboard.clerk.com](https://dashboard.clerk.com)
2. Seleccionar la aplicación
3. Users → seleccionar el usuario
4. Sección **Metadata** → **Public**
5. Agregar: `{ "role": "admin" }`
6. Guardar

### Opción B: Por código (backend/script)

```ts
import { clerkClient } from '@clerk/nextjs/server'

const client = await clerkClient()
await client.users.updateUserMetadata(userId, {
  publicMetadata: { role: 'admin' },
})
```

> `userId` se obtiene desde Clerk Dashboard (Users → seleccionar usuario → User ID) o desde `auth()` en un server component/route handler.

### Leer la metadata en server components

```ts
import { auth, clerkClient } from '@/lib/auth'

const { userId } = await auth()
if (!userId) redirect('/')

const client = await clerkClient()
const user = await client.users.getUser(userId)
const role = (user.publicMetadata as { role?: string })?.role
// role === 'admin' → tiene acceso
```

---

## Resumen de archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `src/proxy.ts` | Modificar → reemplazar auth anterior con Clerk + admin check |
| `src/lib/auth.ts` | Crear → re-exporta `auth`, `currentUser`, `clerkClient` |
| `src/app/layout.tsx` | Modificar → agregar `ClerkProvider`, quitar sidebar/shell |
| `src/app/(app)/layout.tsx` | Crear → sidebar/shell para rutas protegidas |
| `src/app/page.tsx` | Modificar → landing card con sign-in/sign-up y estado no-admin |
| `src/app/unauthorized/page.tsx` | Crear → página de acceso denegado |
| `src/app/(app)/[todas-las-rutas]/` | Mover → desde `src/app/[ruta]/` |
| `src/components/Sidebar.tsx` | Modificar → agregar `UserButton` + `useUser` en el footer |
| `.env.local` | Agregar → keys de Clerk |
| `.env.local.example` | Agregar → documentar las keys necesarias |

---

## Notas importantes

- **`src/proxy.ts` no `src/middleware.ts`:** en Next.js 16 el nombre del archivo de middleware cambió. Usar `middleware.ts` causa página en blanco sin error visible.
- **Route Groups no afectan URLs:** mover páginas dentro de `(app)/` no cambia las rutas públicas.
- **`publicMetadata` vs `privateMetadata`:** usar `publicMetadata` para el rol porque es accesible desde el frontend. `privateMetadata` solo es accesible desde el backend.
- **Organizations deshabilitadas:** si no se usan organizations, deshabilitarlas en el Clerk Dashboard para evitar que el sign-up pida nombre de organización innecesariamente.
- **`bg-surface`:** clase Tailwind custom equivalente a `bg-[#0A0A0A]`. Si la app destino no la tiene, reemplazar con el valor directo o definirla en el config de Tailwind.
- **Imports desde `@/lib/auth`:** nunca importar directo de `@clerk/nextjs/server` en los componentes. El wrapper centraliza los imports y facilita futuros cambios.
- **Hover effects en botones:** los botones usan `hover:scale-[1.02] active:scale-[0.98]` para dar feedback físico al interactuar, más `hover:shadow-[...]` con el color primario para el glow. Requiere `transition-all duration-150`.
- **Rutas de API propias:** si la app tiene route handlers en `src/app/api/`, el middleware los protege automáticamente (salvo `/api/webhooks/*` que está en la lista pública). Verificar que los webhooks de Clerk usen su propio mecanismo de validación (`CLERK_WEBHOOK_SECRET`).
