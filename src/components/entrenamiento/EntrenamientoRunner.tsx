"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { RutinaEjercicio } from "@/types/database";
import { finalizarEntrenamiento } from "@/lib/rutinas/actions";

export function EntrenamientoRunner({
  rutinaId,
  rutinaNombre,
  duracionEstimada,
  ejercicios,
  esPrograma = false,
}: {
  rutinaId: string;
  rutinaNombre: string;
  duracionEstimada: number;
  ejercicios: RutinaEjercicio[];
  esPrograma?: boolean;
}) {
  const [paso, setPaso] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const actual = ejercicios[paso];
  const esUltimo = paso === ejercicios.length - 1;
  const progreso = Math.round(((paso + 1) / ejercicios.length) * 100);

  function siguiente() {
    if (esUltimo) {
      startTransition(() => finalizarEntrenamiento(rutinaId, duracionEstimada, esPrograma));
      return;
    }
    setPaso((p) => Math.min(p + 1, ejercicios.length - 1));
  }

  function anterior() {
    setPaso((p) => Math.max(p - 1, 0));
  }

  return (
    <main className="flex min-h-dvh flex-col px-6 py-8">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 self-start text-sm text-white/50 hover:text-white"
        >
          ← Salir
        </button>

        <p className="mb-1 text-sm text-white/50">{rutinaNombre}</p>

        {/* Barra de progreso */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-brand-500 transition-all"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="mb-6 text-xs text-white/40">
          Ejercicio {paso + 1} de {ejercicios.length}
        </p>

        {/* Ejercicio actual */}
        <div
          key={paso}
          className="card fade-in flex flex-1 flex-col items-center justify-center text-center"
        >
          <h1 className="mb-2 text-2xl font-bold">{actual.ejercicio?.nombre}</h1>

          {actual.ejercicio?.musculos && actual.ejercicio.musculos.length > 0 && (
            <p className="mb-4 text-sm text-white/50">
              {actual.ejercicio.musculos.join(" · ")}
            </p>
          )}

          <div className="mb-4 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white/5 px-3 py-1 text-sm">
              {actual.series} series
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-sm">
              {actual.repeticiones} reps
            </span>
            {actual.peso_recomendado && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm">
                {actual.peso_recomendado}
              </span>
            )}
          </div>

          {/* Leyenda de descanso — sin temporizador funcional por ahora */}
          <p className="mb-2 text-sm text-white/60">
            Descanso sugerido: {formatearDescanso(actual.descanso_seg)}
          </p>

          {actual.instrucciones && (
            <p className="mt-2 max-w-sm text-sm text-white/50">
              {actual.instrucciones}
            </p>
          )}
        </div>

        {/* Controles */}
        <div className="mt-6 flex gap-2">
          <button onClick={() => router.push("/rutinas")} className="btn-secondary flex-1">
            Volver
          </button>
          <button
            onClick={anterior}
            disabled={paso === 0}
            className="btn-secondary flex-1 disabled:opacity-30"
          >
            Anterior
          </button>
          <button onClick={siguiente} disabled={isPending} className="btn-primary flex-1">
            {isPending ? "Guardando..." : esUltimo ? "Terminado" : "Siguiente"}
          </button>
        </div>
      </div>
    </main>
  );
}

function formatearDescanso(segundos: number) {
  if (segundos < 60) return `${segundos} seg`;
  const min = Math.round(segundos / 60);
  return `${min} min`;
}
