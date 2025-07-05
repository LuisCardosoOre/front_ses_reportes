import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { HomologadaCE } from 'src/app/demo/api/cehomologada.models';
import { ProduccionCeService } from 'src/app/demo/service/produccion-ce.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-homologadas-ce',
  templateUrl: './homologadas-ce.component.html',
  styleUrls: ['./homologadas-ce.component.scss'],
})
export class HomologadasCeComponent implements OnInit {
  loading: boolean = false;

  dataOriginal: HomologadaCE[] = [];
  dataFiltrada: HomologadaCE[] = [];

  codSubactividadList:{ label: string, value: string }[] = [];
  codEspecialidadList: { label: string, value: string }[] = [];
  codAgrupadorList: { label: string, value: string }[] = [];
  codVariableList: { label: string, value: string }[] = [];

  filtros = {
    cod_subactividad: null,
    cod_especialidad: null,
    cod_agrupador: null,
    cod_variable: null,
  };

  constructor(private cepService: ProduccionCeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {

    this.cepService.getAllHomologada()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.dataOriginal = res;
          this.dataFiltrada = [...this.dataOriginal];
          this.generarListasDropdown(this.dataOriginal);
        },
        error: (err) => {
          console.error('Error al obtener datos :', err);
        }
      });
  }

  aplicarFiltro() {
    this.dataFiltrada = this.dataOriginal.filter(item => {
      return (!this.filtros.cod_subactividad || item.cod_subactividad === this.filtros.cod_subactividad) &&
        (!this.filtros.cod_especialidad || item.cod_especialidad === this.filtros.cod_especialidad) &&
        (!this.filtros.cod_agrupador || item.cod_agrupador === this.filtros.cod_agrupador) &&
        (!this.filtros.cod_variable || item.cod_variable === this.filtros.cod_variable);
    });
  }

  limpiarFiltro() {
    this.filtros = {
      cod_subactividad: null,
      cod_especialidad: null,
      cod_agrupador: null,
      cod_variable: null,
    };
    this.dataFiltrada = [...this.dataOriginal];
  }

  generarListasDropdown(data: any[]) {
    this.codSubactividadList = [
      ...new Map(data.map(d => [d.cod_subactividad, d.desc_subactividad])).entries()
    ].map(([code, label]) => ({ label, value: code }));

    this.codEspecialidadList = [
      ...new Map(data.map(d => [d.cod_especialidad, d.especialidad])).entries()
    ].map(([code, label]) => ({ label, value: code }));

    this.codAgrupadorList = [
      ...new Map(data.map(d => [d.cod_agrupador, d.agrupador])).entries()
    ].map(([code, label]) => ({ label, value: code }));

    this.codVariableList = [
      ...new Map(data.map(d => [d.cod_variable, d.variable])).entries()
    ].map(([code, label]) => ({ label, value: code }));
  }

  exportToExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.dataOriginal);
  const workbook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  saveAs(blob, `datos_export__homologadas_${new Date().getTime()}.xlsx`);
}
}
