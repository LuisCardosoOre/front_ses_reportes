export class  HojaResponse{
    codigo?: number;
    mensaje?: string;
    fecha?: Date;
    data?: Hoja[];
}

export class Hoja {
    id: number = 0;
    idGrupo: number = 0;
    grupo: string ='';
    idActividad: number = 0;
    actividad: string ='';
    idServicio: number = 0;
    servicio: string ='';
    cantidad: number = 0;
    _editado?: boolean; 


    constructor(){

        /*
        public id: number;
        public idGrupo: number;
        public grupo: string ='';
        public idActividad: number;
        public actividad: string ='';
        public idServicio: number;
        public servicio: string ='';
        public cantidad: number;        
        */

    }
}
