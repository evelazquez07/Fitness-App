"use client";

import { useFormState } from "react-dom";
import { saveOnboarding } from "@/lib/profile/actions";
import type { AuthState } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";

const initialState: AuthState = { error: null };

export function OnboardingForm({
  objetivos,
  perfil,
  textoBoton = "Guardar y continuar",
}: {
  objetivos: { id: string; nombre: string }[];
  perfil?: {
    nombre?: string | null;
    edad?: number | null;
    sexo?: string | null;
    estatura_cm?: number | null;
    peso_kg?: number | null;
    nivel?: string | null;
    objetivo_id?: string | null;
    dias_disponibles?: number | null;
    minutos_por_sesion?: number | null;
    lugar_entreno?: string | null;
  };
  textoBoton?: string;
}) {
  const [state, formAction] = useFormState(saveOnboarding, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input className="input" name="nombre" placeholder="Nombre" defaultValue={perfil?.nombre ?? ""} required />

      <div className="grid grid-cols-2 gap-3">
        <input
          className="input"
          name="edad"
          type="number"
          placeholder="Edad"
          min={10}
          max={100}
          defaultValue={perfil?.edad ?? ""}
        />
        <select className="input" name="sexo" defaultValue={perfil?.sexo ?? ""}>
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
          defaultValue={perfil?.estatura_cm ?? ""}
        />
        <input
          className="input"
          name="peso_kg"
          type="number"
          placeholder="Peso (kg)"
          defaultValue={perfil?.peso_kg ?? ""}
        />
      </div>

      <select className="input" name="nivel" defaultValue={perfil?.nivel ?? ""}>
        <option value="" disabled>
          Nivel de experiencia
        </option>
        <option value="principiante">Principiante</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
      </select>

      <select className="input" name="objetivo_id" defaultValue={perfil?.objetivo_id ?? ""}>
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
        <select className="input" name="dias_disponibles" defaultValue={perfil?.dias_disponibles ?? ""}>
          <option value="" disabled>
            Días por semana
          </option>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n}>
              {n} día{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <select className="input" name="minutos_por_sesion" defaultValue={perfil?.minutos_por_sesion ?? ""}>
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

      <select className="input" name="lugar_entreno" defaultValue={perfil?.lugar_entreno ?? ""}>
        <option value="" disabled>
          ¿Dónde entrenas?
        </option>
        <option value="casa">Casa</option>
        <option value="gimnasio">Gimnasio</option>
      </select>

      <FormError message={state.error} />
      <SubmitButton>{textoBoton}</SubmitButton>
    </form>
  );
}
