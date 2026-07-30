# FitApp — Fase 1

Base del proyecto: autenticación (Supabase Auth) + perfil de usuario (onboarding).

## 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor** → pega el contenido de `supabase/migrations/0001_init.sql` → Run.
3. En **Project Settings → API**, copia `Project URL` y `anon public key`.
4. En **Authentication → URL Configuration**, agrega tu dominio de Vercel (y `http://localhost:3000` para dev) en *Site URL* y *Redirect URLs* (incluye `/auth/callback`).

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y llena:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Instalar y correr localmente

```bash
npm install
npm run dev
```

## 4. GitHub + Vercel

1. Crea un repo en GitHub y sube este proyecto (`.env.local` NO se sube, ya está en `.gitignore`).
2. En Vercel → Add New Project → importa el repo.
3. En Vercel → Settings → Environment Variables, agrega las mismas 3 variables de `.env.local` (usa la URL real de Vercel en `NEXT_PUBLIC_SITE_URL`).
4. Deploy.

## Qué incluye esta fase

- Registro, login, logout, recuperar contraseña (Supabase Auth)
- Middleware que protege rutas privadas y redirige según sesión
- Tabla `profiles` + `objetivos` con RLS (cada usuario solo ve/edita su propio perfil)
- Onboarding que guarda el perfil físico y objetivo del usuario
- Dashboard placeholder (contenido real en fase 2)

## Siguiente fase (propuesta)

Dashboard real: tarjeta "Entrenamiento de hoy", racha, progreso semanal — requiere las tablas `rutinas`, `ejercicios` y `entrenamientos_realizados`.
