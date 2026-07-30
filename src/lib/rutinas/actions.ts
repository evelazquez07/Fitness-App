"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revisarLogros } from "@/lib/logros/queries";

export async function finalizarEntrenamiento(rutinaId: string, duracionMin: number) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("entrenamientos_realizados").insert({
    user_id: user.id,
    rutina_id: rutinaId,
    duracion_min: duracionMin,
    completado: true,
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("racha_dias, experiencia, ultimo_entreno_en")
    .eq("id", user.id)
    .single();

  const entrenoAyer = profile?.ultimo_entreno_en
    ? esDeAyer(new Date(profile.ultimo_entreno_en))
    : false;
  const entrenoHoy = profile?.ultimo_entreno_en
    ? esDeHoy(new Date(profile.ultimo_entreno_en))
    : false;

  const nuevaRacha = entrenoHoy
    ? profile?.racha_dias ?? 1
    : entrenoAyer
      ? (profile?.racha_dias ?? 0) + 1
      : 1;
  const nuevaExperiencia = (profile?.experiencia ?? 0) + 20;
  const nuevoNivel = Math.floor(nuevaExperiencia / 100) + 1;

  await supabase
    .from("profiles")
    .update({
      racha_dias: nuevaRacha,
      experiencia: nuevaExperiencia,
      nivel_gamificacion: nuevoNivel,
      ultimo_entreno_en: new Date().toISOString(),
    })
    .eq("id", user.id);

  const { count: totalEntrenamientos } = await supabase
    .from("entrenamientos_realizados")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await revisarLogros(supabase, user.id, totalEntrenamientos ?? 0, nuevaRacha);

  redirect("/dashboard");
}

function esDeAyer(fecha: Date) {
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  return fecha.toDateString() === ayer.toDateString();
}

function esDeHoy(fecha: Date) {
  return fecha.toDateString() === new Date().toDateString();
}
