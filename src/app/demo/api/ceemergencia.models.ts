export interface EmergenciaRegistro {
  cod_centro: string;
  periodo: string;
  cod_estandar: string;
  areas_emergencia: string;
  cod_tipo_paciente: string;
  tipo_paciente: string;
  cod_prioridad: string;
  tipo: string; // Ej: 'Prioridad I'
  cantidad: number;
}

export interface EmergenciaResumen {
  tipo: string;
  lista: { periodo: string; area: string; cantidad: number }[];
  total: number;
}