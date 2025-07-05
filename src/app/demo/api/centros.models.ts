export class Centro {
  cod_centro: string='';
  desc_centro: string='';
}

export class Red {
  cod_red: string= '';
  desc_red: string='';
  desc_red_corto: string='';
  centros: Centro[] = [];
}
