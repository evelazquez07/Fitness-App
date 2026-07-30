-- ============================================================
-- Fase 1: Objetivos (catálogo extensible) + Perfiles de usuario
-- ============================================================

-- Catálogo de objetivos, editable sin tocar código
create table if not exists public.objetivos (
  id text primary key,               -- slug: 'masa_muscular', 'definicion', etc.
  nombre text not null,
  descripcion text,
  orden int not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.objetivos enable row level security;

create policy "Objetivos visibles para todos los autenticados"
  on public.objetivos for select
  to authenticated
  using (true);

insert into public.objetivos (id, nombre, orden) values
  ('masa_muscular', 'Ganar masa muscular', 1),
  ('definicion', 'Definición', 2),
  ('perdida_grasa', 'Pérdida de grasa', 3),
  ('fuerza', 'Fuerza', 4),
  ('resistencia', 'Resistencia', 5),
  ('salud_general', 'Salud general', 6),
  ('principiante', 'Principiante', 7),
  ('intermedio', 'Intermedio', 8),
  ('avanzado', 'Avanzado', 9),
  ('hipertrofia', 'Hipertrofia', 10),
  ('tonificacion', 'Tonificación', 11),
  ('funcional', 'Entrenamiento funcional', 12),
  ('calistenia', 'Calistenia', 13),
  ('en_casa', 'Entrenamiento en casa', 14),
  ('adulto_mayor', 'Adulto mayor', 15)
on conflict (id) do nothing;

-- Perfil de usuario, 1:1 con auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  edad int,
  sexo text check (sexo in ('masculino', 'femenino', 'otro')),
  estatura_cm numeric,
  peso_kg numeric,
  nivel text check (nivel in ('principiante', 'intermedio', 'avanzado')),
  objetivo_id text references public.objetivos (id),
  dias_disponibles int check (dias_disponibles between 1 and 7),
  minutos_por_sesion int,
  lugar_entreno text check (lugar_entreno in ('casa', 'gimnasio')),
  onboarding_completado boolean not null default false,
  -- Campos de gamificación, listos desde ya para fases futuras
  experiencia int not null default 0,
  nivel_gamificacion int not null default 1,
  racha_dias int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Usuarios crean su propio perfil"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Crea automáticamente un profile vacío al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Mantiene updated_at al día
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
