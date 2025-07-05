import { Component, OnInit } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { HojaService } from '../../../service/hoja.service';
import { Hoja } from '../../../api/hoja.models';

@Component({
  selector: 'app-consulta-externa',
  templateUrl: './consulta-externa.component.html',
  styleUrls: ['./consulta-externa.component.scss']
})
export class ConsultaExternaComponent implements OnInit {

  //datos: any[] = [];
  loading: boolean = true;
  titulo: string = 'CONSULTA EXTERNA';
  lstHojas: Hoja[] = [];

  loadingCarga: boolean = true;

  visible = false;
  archivo: File | null = null;

  constructor(private hojaService: HojaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit(): void {

    const savedPeriodo: string = sessionStorage.getItem('selectedPeriodo') ?? '';
    const savedHoja: number = Number(sessionStorage.getItem('selectedHojas')) || 0;

    console.log(savedPeriodo);
    console.log(savedHoja)

    this.hojaService.getPeriodoHoja(savedPeriodo,savedHoja)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.loadingCarga = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.lstHojas = res;
        },
        error: (err) => {
          console.error('Error al obtener datos :', err);
        }
      });
  }

  guardar(){
    console.log('GUARDAR')
    
    const filasEditadas = this.lstHojas.filter(r => r._editado);

    console.log(filasEditadas)

    if (filasEditadas.length === 0) {
      this.messageService.add({ severity: 'warm', summary: 'Información', detail: 'No hay cambios para guardar'});
      return;
    }
    const datosParaGuardar = filasEditadas.map(({ _editado, ...limpio }) => limpio);
    console.log(datosParaGuardar);


    this.hojaService.guardar(datosParaGuardar).subscribe({
      next: (msj: string) => {
        console.log('✅ Cambios guardados con éxito');
        this.messageService.add({ severity: 'success', summary: 'Registro', detail: msj });
        // Desmarcar las filas
        filasEditadas.forEach(fila => fila._editado = false);
      },
      error: err => {
        console.error('❌ Error al guardar cambios', err);
      }
    });


  }

  actualizar(row: any) {    

    if (this.isCantidadValida(row.cantidad)) {
      console.log('ROW :', row);
      this.messageService.add({ severity: 'info', summary: 'Información', detail: row.actividad + ' ' + row.servicio});
      row._editado = true;
      console.log('ROW E:', row);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Información', detail: 'La cantidad debe ser un número mayor que cero'});
      row.cantidad = null;
    }
    /*
    const { _editado, ...limpio } = row;
    console.log('Cantidad actualizada:', row);
    // Aquí puedes enviar los datos al backend si deseas
    this.messageService.add({ severity: 'info', summary: 'Información', detail: row.actividad + ' ' + row.servicio, sticky: true });

    if (this.isCantidadValida(row.cantidad)) {
      console.log('ENVIANDO A ANGULAR:', row);
      this.hojaService.update(row.id, row).subscribe({
        next: (res) => {
          console.log('DATA JAVA:', limpio);
          console.log('RES:', res);
          this.messageService.add({ severity: 'success', summary: 'Registro', detail: 'Dato registrado correctamente' });
          row._editado = true;
        },
        error: (err) => console.error('Error al actualizar:', err),
      });
    } else {
      alert('La cantidad debe ser un número mayor que cero');
      row.cantidad = null;
    }
    */
  }


  isCantidadValida(cantidad: any): boolean {
    return cantidad !== null && cantidad !== '' && !isNaN(cantidad) && Number(cantidad) > 0;
  }

  cargarDatos() {
    console.log("DEMI");
    this.loadingCarga = true;
    this.loading = true;
    const savedPeriodo: string = sessionStorage.getItem('selectedPeriodo') ?? '';
    const savedHoja: number = Number(sessionStorage.getItem('selectedHojas')) || 0;

    console.log("Peri" + savedPeriodo);
    console.log("HOJ" + savedHoja);

    this.hojaService.getPeriodoHoja(savedPeriodo,savedHoja)
    .pipe(
      finalize(() => {
        this.loading = false;
        this.loadingCarga = false;
      })
    )
    .subscribe({
      next: (res) => {
        this.lstHojas = res;
      },
      error: (err) => {
        console.error('Error al obtener datos :', err);
      }
    });
  }

  abrirDialogo() {
    this.visible = true;
  }

  cerrarDialogo() {
    this.visible = false;
    this.archivo = null;
  }

  onArchivoSeleccionado(file: File) {
    const esExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!esExcel) {
      this.messageService.add({ severity: 'error', summary: 'Información', detail: 'Formato no válido. Solo Excel.'});
      return;
    }
    this.archivo = file;
  }

  subirArchivo() {
    if (!this.archivo) {
       this.messageService.add({ severity: 'error', summary: 'Información', detail: 'Seleccione un archivo válido.'});
      return;
    }

    const savedPeriodo: string = sessionStorage.getItem('selectedPeriodo') ?? '';
    const savedHoja: number = Number(sessionStorage.getItem('selectedHojas')) || 0;

    const formData = new FormData();
    formData.append('file', this.archivo);
    formData.append('periodo', savedPeriodo);
    formData.append('idTipoHoja', savedHoja.toString());

    this.hojaService.uploadFile(formData).subscribe({
      next: (res) => {
        alert('Archivo subido correctamente');
        this.messageService.add({ severity: 'success', summary: 'Registro', detail: res });
        this.cerrarDialogo();
      },
      error: (err) => {
        console.error(err);
        alert('Error al subir archivo');
      }
    });
  }  

}
