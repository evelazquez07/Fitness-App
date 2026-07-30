export function FormError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
      {message}
    </p>
  );
}
