import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEjerciciosDeRutina } from "@/lib/rutinas/queries";
import { EntrenamientoRunner } from "@/components/entrenamiento/EntrenamientoRunner";

export default async function EntrenamientoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { programa?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rutina } = await supabase
    .from("rutinas")
    .select("id, nombre, duracion_min")
    .eq("id", params.id)
    .single();

  if (!rutina) notFound();

  const ejercicios = await getEjerciciosDeRutina(supabase, rutina.id);
  if (ejercicios.length === 0) notFound();

  return (
    <EntrenamientoRunner
      rutinaId={rutina.id}
      rutinaNombre={rutina.nombre}
      duracionEstimada={rutina.duracion_min ?? 0}
      ejercicios={ejercicios}
      esPrograma={searchParams.programa === "1"}
    />
  );
}
