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

export interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  musculos: string[];
  imagen_url: string | null;
}

export interface Rutina {
  id: string;
  nombre: string;
  descripcion: string | null;
  objetivo_id: string | null;
  nivel: Nivel | null;
  lugar_entreno: "casa" | "gimnasio" | "ambos" | null;
  duracion_min: number | null;
  grupo_muscular: string | null;
}

export interface RutinaEjercicio {
  id: string;
  rutina_id: string;
  ejercicio_id: string;
  orden: number;
  series: number;
  repeticiones: string;
  peso_recomendado: string | null;
  descanso_seg: number;
  instrucciones: string | null;
  ejercicio?: Ejercicio;
}

export interface EntrenamientoRealizado {
  id: string;
  user_id: string;
  rutina_id: string | null;
  duracion_min: number | null;
  completado: boolean;
  realizado_en: string;
}
