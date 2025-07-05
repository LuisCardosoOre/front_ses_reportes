export interface Subactividad {
  cod_subactividad: string;
  desc_subactividad: string;
  mensual: { [mes: string]: number };
  total_subactividad: number;
}

export interface ServicioOriginal {
  cod_servicio: string;
  desc_servicio: string;
  total_servicio: number;
  subactividades: Subactividad[];
}

export interface DiagnosticoOriginal {
  cod_diagnostico?: string;
  desc_diagnostico?: string;
  cod_red: string;
  cod_centro: string;
  tipo_paciente: string;
  cod_variable: string;
  cod_agrupador: string;
  cod_especialidad: string;
  total_diagnostico: number;
  servicios: ServicioOriginal[];
}

// Agrupados
export interface DiagnosticoAgrupado {
  cod_diagnostico: string;
  desc_diagnostico: string;
  servicios: ServicioAgrupado[];
  total_diagnostico: number;
}

export interface ServicioAgrupado {
  cod_servicio: string;
  desc_servicio: string;
  total_servicio: number;
  mensual: { [mes: string]: number };
  subactividades: Subactividad[];
}

export interface FilaDiagnosticoPlano {
  cod_diagnostico: string;
  desc_diagnostico: string;
  cod_servicio: string;
  desc_servicio: string;
  cod_subactividad: string;
  desc_subactividad: string;
  mes: string;
  cantidad: number;
  total_subactividad: number;
  total_servicio: number;
  tipo_paciente: string;
  cod_centro: string;
  cod_red: string;
  cod_variable: string;
  cod_agrupador: string;
  cod_especialidad: string;
}