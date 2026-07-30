export type Nivel = "principiante" | "intermedio" | "avanzado";
export type Sexo = "masculino" | "femenino" | "otro";
export type LugarEntreno = "casa" | "gimnasio";

export interface Profile {
  id: string;
  nombre: string | null;
  edad: number | null;
  sexo: Sexo | null;
  estatura_cm: number | null;
  peso_kg: number | null;
  nivel: Nivel | null;
  objetivo_id: string | null;
  dias_disponibles: number | null;
  minutos_por_sesion: number | null;
  lugar_entreno: LugarEntreno | null;
  onboarding_completado: boolean;
  experiencia: number;
  nivel_gamificacion: number;
  racha_dias: number;
  created_at: string;
  updated_at: string;
}

export interface Objetivo {
  id: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
  created_at: string;
}

// Estructura mínima requerida por @supabase/ssr. Se puede reemplazar por
// el archivo generado con `supabase gen types typescript` cuando el
// proyecto tenga más tablas.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      objetivos: {
        Row: Objetivo;
        Insert: Partial<Objetivo> & { id: string; nombre: string };
        Update: Partial<Objetivo>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
