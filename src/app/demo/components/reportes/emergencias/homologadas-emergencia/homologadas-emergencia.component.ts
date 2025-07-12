import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { Centro, Red } from 'src/app/demo/api/centros.models';
import { HomologadaEmergencia } from 'src/app/demo/api/emergencia_homologada.models';
import { ProduccionCeService } from 'src/app/demo/service/produccion-ce.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-homologadas-emergencia',
  templateUrl: './homologadas-emergencia.component.html',
  styleUrls: ['./homologadas-emergencia.component.scss']
})
export class HomologadasEmergenciaComponent implements OnInit {

  loading: boolean = false;
  dataOriginal: HomologadaEmergencia[] = [];
  dataFiltrada: HomologadaEmergencia[] = [];
  centrosList: { label: string; value: string }[] = [];

  redes: Red[] = [];
  selectedRed: Red | null = null;
  selectedCentro: Centro | null = null;

  constructor(private cepService: ProduccionCeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit(): void {
this.loading = true;

        this.cepService.getCentros().subscribe({
      next: (res) => {
        this.redes = res;
      },
      error: (err) => {
        console.error('Error al obtener datos Red:', err);
      },
    });

    this.cepService.getAllEmergenciaHomologada()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.dataOriginal = res;
          this.dataFiltrada = [...this.dataOriginal];
        },
        error: (err) => {
          console.error('Error al obtener datos :', err);
        }
      });

  }


  aplicarFiltro(): void {
    this.dataFiltrada = this.selectedCentro?.cod_centro 
      ? this.dataOriginal.filter(d => String(d.cod_centro) === this.selectedCentro?.cod_centro)
      : [...this.dataOriginal];
  }

  limpiarFiltro(): void {
    this.selectedCentro = null;
    this.dataFiltrada = [...this.dataOriginal];
  }

  exportToExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.dataOriginal);
  const workbook = { Sheets: { 'Emergencias': worksheet }, SheetNames: ['Emergencias'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  saveAs(blob, `emergencias_homologadas_export_${new Date().getTime()}.xlsx`);
}

}
