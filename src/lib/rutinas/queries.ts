import { createClient } from "@/lib/supabase/server";
import type { Profile, Rutina, RutinaEjercicio } from "@/types/database";

type SupabaseServer = ReturnType<typeof createClient>;

/**
 * Elige una rutina activa que coincida con el objetivo, nivel y lugar de
 * entreno del perfil. Si no hay coincidencia exacta, relaja los filtros
 * en cascada para siempre devolver algo entrenable.
 */
export async function getRutinaDeHoy(
  supabase: SupabaseServer,
  profile: Pick<Profile, "objetivo_id" | "nivel" | "lugar_entreno">
): Promise<Rutina | null> {
  const orCondiciones = [
    profile.objetivo_id ? `objetivo_id.eq.${profile.objetivo_id}` : null,
    profile.nivel ? `nivel.eq.${profile.nivel}` : null,
  ].filter(Boolean) as string[];

  const base = () => supabase.from("rutinas").select("*").eq("activa", true);

  const intentos = [
    () =>
      orCondiciones.length
        ? base().or(orCondiciones.join(",")).in("lugar_entreno", [profile.lugar_entreno ?? "", "ambos"])
        : null,
    () => (orCondiciones.length ? base().or(orCondiciones.join(",")) : null),
    () => base().in("lugar_entreno", [profile.lugar_entreno ?? "", "ambos"]),
    () => base(),
  ];

  for (const intento of intentos) {
    const query = intento();
    if (!query) continue;
    const { data } = await query;
    if (data && data.length > 0) return elegirDelDia(data as Rutina[]);
  }

  return null;
}

/** Rota entre las coincidencias según el día del año, así "hoy" cambia cada día. */
function elegirDelDia(rutinas: Rutina[]): Rutina {
  const inicioAno = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - inicioAno.getTime();
  const diaDelAno = Math.floor(diff / 86400000);
  return rutinas[diaDelAno % rutinas.length];
}

export async function getEjerciciosDeRutina(
  supabase: SupabaseServer,
  rutinaId: string
): Promise<RutinaEjercicio[]> {
  const { data } = await supabase
    .from("rutina_ejercicios")
    .select("*, ejercicio:ejercicios(*)")
    .eq("rutina_id", rutinaId)
    .order("orden");

  return (data ?? []) as unknown as RutinaEjercicio[];
}

export async function getHistorialUsuario(supabase: SupabaseServer, userId: string) {
  const { data } = await supabase
    .from("entrenamientos_realizados")
    .select("id, duracion_min, realizado_en, rutina:rutinas(nombre)")
    .eq("user_id", userId)
    .order("realizado_en", { ascending: false })
    .limit(30);

  return (data ?? []) as unknown as {
    id: string;
    duracion_min: number | null;
    realizado_en: string;
    rutina: { nombre: string } | null;
  }[];
}

/** Minutos entrenados por día en los últimos 7 días, para la gráfica de barras. */
export async function getMinutosPorDia(supabase: SupabaseServer, userId: string) {
  const desde = new Date();
  desde.setDate(desde.getDate() - 6);
  desde.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("entrenamientos_realizados")
    .select("duracion_min, realizado_en")
    .eq("user_id", userId)
    .gte("realizado_en", desde.toISOString());

  const dias: { fecha: Date; etiqueta: string; minutos: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    dias.push({
      fecha,
      etiqueta: fecha.toLocaleDateString("es-MX", { weekday: "short" }),
      minutos: 0,
    });
  }

  for (const registro of data ?? []) {
    const fechaRegistro = new Date(registro.realizado_en);
    const dia = dias.find((d) => d.fecha.toDateString() === fechaRegistro.toDateString());
    if (dia) dia.minutos += registro.duracion_min ?? 0;
  }

  return dias;
}

export async function getEstadisticasUsuario(
  supabase: SupabaseServer,
  userId: string,
  statsResetEn?: string | null
) {
  const hace7dias = new Date();
  hace7dias.setDate(hace7dias.getDate() - 7);
  const reset = statsResetEn ? new Date(statsResetEn) : null;
  const desde = reset && reset > hace7dias ? reset : hace7dias;

  const { data: historial } = await supabase
    .from("entrenamientos_realizados")
    .select("duracion_min, realizado_en")
    .eq("user_id", userId)
    .gte("realizado_en", desde.toISOString());

  const entrenamientosSemana = historial?.length ?? 0;
  const minutosSemana = (historial ?? []).reduce(
    (acc: number, h: { duracion_min: number | null }) => acc + (h.duracion_min ?? 0),
    0
  );

  return { entrenamientosSemana, minutosSemana };
}
