"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "@/lib/auth/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { FormError } from "@/components/ui/FormError";

const initialState: AuthState = { error: null };

export default function RecuperarPage() {
  const [enviado, setEnviado] = useState(false);
  const [state, formAction] = useFormState(async (prev: AuthState, fd: FormData) => {
    const result = await requestPasswordReset(prev, fd);
    if (result.error === null) setEnviado(true);
    return result;
  }, initialState);

  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-bold">Recuperar contraseña</h1>
        <p className="mb-8 text-white/60">
          Te enviaremos un enlace a tu correo para restablecerla.
        </p>

        {!enviado ? (
          <form action={formAction} className="space-y-4">
            <input
              className="input"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              required
            />
            <FormError message={state.error} />
            <SubmitButton>Enviar enlace</SubmitButton>
          </form>
        ) : (
          <p className="rounded-lg bg-brand-500/10 px-3 py-2 text-sm text-brand-400">
            Si el correo existe, te llegará un enlace en unos minutos.
          </p>
        )}

        <Link href="/login" className="mt-4 inline-block text-sm text-white/60 hover:text-white">
          Volver a iniciar sesión
        </Link>
      </div>
    </main>
  );
}
