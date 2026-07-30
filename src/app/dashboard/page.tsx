import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth/actions";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, onboarding_completado")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completado) redirect("/onboarding");

  return (
    <main className="min-h-dvh px-6 py-10">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Hola, {profile.nombre} 👋</h1>
          <form action={signOut}>
            <button className="text-sm text-white/60 hover:text-white" type="submit">
              Cerrar sesión
            </button>
          </form>
        </div>

        <div className="card">
          <p className="text-white/70">
            Perfil creado correctamente. El dashboard completo (entrenamiento
            de hoy, racha, estadísticas y logros) llega en la siguiente fase.
          </p>
        </div>
      </div>
    </main>
  );
}
