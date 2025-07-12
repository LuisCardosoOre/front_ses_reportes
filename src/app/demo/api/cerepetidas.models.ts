export interface RepetidasCE {
  desc_servicio: string;
  subactividades: SubactividadRE[];
  total_servicio: number;
  mensual: { [mes: string]: number }; // <-- agregamos para cálculos dinámicos si es necesario


  cod_red: string;
  cod_centro: string;
  anio: string;
  cod_servicio: string;
  cod_especialidad: string;
  cod_agrupador: string;
  cod_variable: string;
  tipo_paciente: string;
}

export interface SubactividadRE {
  cod_subactividad: string;
  desc_subactividad: string;
  total_subactividad: number;
  mensual: { [mes: string]: number };
}

export interface AgrupadoRepetidasCE {
  cod_servicio: string;
  desc_servicio: string;
  subactividades: SubactividadRE[];
  mensual: { [mes: string]: number };
  total_servicio: number;
}