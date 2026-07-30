"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold">Bienvenido de vuelta</h1>
        <p className="mb-8 text-white/60">Inicia sesión para continuar tu entrenamiento.</p>

        <form action={formAction} className="space-y-4">
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Contraseña"
            required
          />
          <FormError message={state.error} />
          <SubmitButton>Iniciar sesión</SubmitButton>
        </form>

        <div className="mt-4 flex justify-between text-sm text-white/60">
          <Link href="/recuperar" className="hover:text-white">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link href="/registro" className="hover:text-white">
            Crear cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}
