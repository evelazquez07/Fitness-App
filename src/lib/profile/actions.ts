"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "@/lib/auth/actions";

export async function setMusculosPorSesion(valor: 1 | 2) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("profiles").update({ musculos_por_sesion: valor }).eq("id", user.id);
  redirect("/dashboard");
}

export async function saveOnboarding(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sesión no encontrada. Inicia sesión de nuevo." };

  const { error } = await supabase
    .from("profiles")
    .update({
      nombre: String(formData.get("nombre") ?? ""),
      edad: Number(formData.get("edad")) || null,
      sexo: String(formData.get("sexo") ?? "") || null,
      estatura_cm: Number(formData.get("estatura_cm")) || null,
      peso_kg: Number(formData.get("peso_kg")) || null,
      nivel: String(formData.get("nivel") ?? "") || null,
      objetivo_id: String(formData.get("objetivo_id") ?? "") || null,
      dias_disponibles: Number(formData.get("dias_disponibles")) || null,
      minutos_por_sesion: Number(formData.get("minutos_por_sesion")) || null,
      lugar_entreno: String(formData.get("lugar_entreno") ?? "") || null,
      onboarding_completado: true,
    })
    .eq("id", user.id);

  if (error) return { error: "No se pudo guardar tu perfil. Intenta de nuevo." };
  redirect("/dashboard");
}
