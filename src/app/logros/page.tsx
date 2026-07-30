import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/ui/BottomNav";
import { getLogrosUsuario } from "@/lib/logros/queries";

export default async function LogrosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const logros = await getLogrosUsuario(supabase, user.id);

  return (
    <main className="min-h-dvh px-6 py-8 pb-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Logros</h1>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {logros.map((l) => (
            <div
              key={l.id}
              className={`card fade-in text-center ${!l.desbloqueado ? "opacity-40" : ""}`}
            >
              <p className="mb-2 text-3xl">{l.icono}</p>
              <p className="font-semibold">{l.nombre}</p>
              <p className="mt-1 text-xs text-white/50">{l.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
          <BottomNav />
    </main>
  );
}
