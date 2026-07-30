"use client";

import { useFormState } from "react-dom";
import { saveOnboarding } from "@/lib/profile/actions";
import type { AuthState } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";

const initialState: AuthState = { error: null };

export function OnboardingForm({
  objetivos,
}: {
  objetivos: { id: string; nombre: string }[];
}) {
  const [state, formAction] = useFormState(saveOnboarding, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input className="input" name="nombre" placeholder="Nombre" required />

      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          name="edad"
          type="number"
          placeholder="Edad"
          min={10}
          max={100}
        />
        <select className="input" name="sexo" defaultValue="">
          <option value="" disabled>
            Sexo
          </option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          name="estatura_cm"
          type="number"
          placeholder="Estatura (cm)"
        />
        <input
          className="input"
          name="peso_kg"
          type="number"
          placeholder="Peso (kg)"
        />
      </div>

      <select className="input" name="nivel" defaultValue="">
        <option value="" disabled>
          Nivel de experiencia
        </option>
        <option value="principiante">Principiante</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
      </select>

      <select className="input" name="objetivo_id" defaultValue="">
        <option value="" disabled>
          Objetivo principal
        </option>
        {objetivos.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <select className="input" name="dias_disponibles" defaultValue="">
          <option value="" disabled>
            Días por semana
          </option>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} día{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <select className="input" name="minutos_por_sesion" defaultValue="">
          <option value="" disabled>
            Minutos/sesión
          </option>
          {[20, 30, 45, 60, 90].map((n) => (
            <option key={n} value={n}>
              {n} min
            </option>
          ))}
        </select>
      </div>

      <select className="input" name="lugar_entreno" defaultValue="">
        <option value="" disabled>
          ¿Dónde entrenas?
        </option>
        <option value="casa">Casa</option>
        <option value="gimnasio">Gimnasio</option>
      </select>

      <FormError message={state.error} />
      <SubmitButton>Guardar y continuar</SubmitButton>
    </form>
  );
}
