import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabla-editar',
  templateUrl: './tabla-editar.component.html',
  styleUrls: ['./tabla-editar.component.scss']
})
export class TablaEditarComponent  implements OnInit  {

  @Input()
  datos: any[] = [];
  @Input()
  loading: boolean = false;

  @Output() editar: EventEmitter<object> = new EventEmitter<object>();
  
  constructor() { }

  ngOnInit(): void {
  }



  
  isCantidadValida(cantidad: any): boolean {
    return cantidad !== null && cantidad !== '' && !isNaN(cantidad) && Number(cantidad) > 0;
  }

  onCantidadEditComplete(row: any): void {
    console.log("row")
    if (this.isCantidadValida(row.cantidad)) {
      this.editar.emit(row);  
      row._editado = true;
    } else {      
      row.cantidad = null;
    }
  }

}
