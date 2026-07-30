"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";

const initialState: AuthState = { error: null };

export default function RegistroPage() {
  const [state, formAction] = useFormState(signUp, initialState);

  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold">Crea tu cuenta</h1>
        <p className="mb-8 text-white/60">Empieza a entrenar hoy mismo.</p>

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
            placeholder="Contraseña (mín. 6 caracteres)"
            minLength={6}
            required
          />
          <FormError message={state.error} />
          <SubmitButton>Crear cuenta</SubmitButton>
        </form>

        <p className="mt-4 text-sm text-white/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-500">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
