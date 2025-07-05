
export class ConsultaCE {

    cod_centro: string ='';
    periodo: string ='';
    agrupador: string ='';
    tipo_paciente : string ='';
    cantidad : number = 0;
    variable: string ='';

    constructor(){

    }
}

export interface AgrupadoCE {
  periodo: string;
  tipo: string;
  cantidad: number;
}