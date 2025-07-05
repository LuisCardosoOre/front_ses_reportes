import { Component , EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-barra-produccion',
  templateUrl: './barra-produccion.component.html',
  styleUrls: ['./barra-produccion.component.scss']
})
export class BarraProduccionComponent implements OnInit {


  periodo: Combos[] = [];
  hojas: Combos[] = [];

  selectedPeriodo!: Combos;
  selectedHojas!: Combos;

  @Input()
  loading: boolean = false;
  @Input() 
  titulo: string = '';

  @Output() cargar: EventEmitter<object> = new EventEmitter<object>();  
  @Output() guardar: EventEmitter<object> = new EventEmitter<object>(); 
  @Output() abrir: EventEmitter<object> = new EventEmitter<object>(); 


  ngOnInit() {

    this.periodo = [
            { name: '202501', code: '202501' },
            { name: '202502', code: '202502' },
            { name: '202503', code: '202503' },
            { name: '202504', code: '202504' },
            { name: '202505', code: '202505' },
            { name: '202506', code: '202506' },
          ];
    this.hojas = [
            { name: 'Asegurados Centro Asistencial', code: '116' },   
            { name: 'No Asegurados Centro Asistencial', code: '117' },
            { name: 'Asegurados Posta Medicas', code: '118' },
            { name: 'No Asegurados Posta Medicas', code: '119' },  
          ]; 

    const savedPeriodo = sessionStorage.getItem('selectedPeriodo');
    const savedHoja = sessionStorage.getItem('selectedHojas');

    if (savedPeriodo) this.selectedPeriodo = this.periodo.find(p => p.name === savedPeriodo) || this.periodo[0];
    else this.selectedPeriodo = this.periodo[0];

    if (savedHoja) this.selectedHojas = this.hojas.find(h => h.code === savedHoja) || this.hojas[0];
    else this.selectedHojas = this.hojas[0];

  }


  onPeriodoChange() {
    sessionStorage.setItem('selectedPeriodo', this.selectedPeriodo.name);
    console.log(this.selectedPeriodo)
    console.log()
  }

  onHojaChange() {
    sessionStorage.setItem('selectedHojas', this.selectedHojas.code);
    console.log(this.selectedHojas)
  }
}

interface Combos {
  name: string;
  code: string;
}