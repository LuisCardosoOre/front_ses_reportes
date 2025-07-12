import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmergenciaRegistro, EmergenciaResumen } from 'src/app/demo/api/ceemergencia.models';
import { ProduccionCeService } from 'src/app/demo/service/produccion-ce.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Centro, Red } from 'src/app/demo/api/centros.models';


@Component({
  selector: 'app-prioridades',
  templateUrl: './prioridades.component.html',
  styleUrls: ['./prioridades.component.scss']
})
export class PrioridadesComponent implements OnInit {

  registros: EmergenciaRegistro[] = [];
  tarjetas: EmergenciaResumen[] = [];

  redes: Red[] = [];
  selectedRed: Red | null = null;
  selectedCentro: Centro | null = null;
  periodos: string[] = [];
  codigosPaciente: { label: string; value: string }[] = [];



  selectedPeriodo = '';
  selectedTipoPaciente = '';

  tipoOrden: string[] = ['Prioridad I', 'Prioridad II','Prioridad III','Prioridad IV','Egreso Obs > 24 Hr','Egreso Obs <= 24 Hr','DEFUNCIONES'];

  loading = false;
  readonly placeholders = Array.from({ length: 8 }, (_, i) => ({
    tipo: `Cargando ${i + 1}`,
    lista: [],
    total: 0,
  }));

  constructor(private service: ProduccionCeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loading = true;
    this.service.getCentros().subscribe({
      next: (res) => {
        this.redes = res;
      },
      error: (err) => {
        console.error('Error al obtener datos Red:', err);
      },
    });
    this.service.getAllEmergencia().subscribe({
      next: (data: EmergenciaRegistro[]) => {
        this.registros = data;


        this.periodos = [...new Set(data.map(d => d.periodo).filter(Boolean))];
        this.codigosPaciente = Array.from(
          new Set(this.registros.map(r => r.cod_tipo_paciente).filter(v => v != null && v.trim() !== ''))
        ).map(codigo => ({
          label: codigo === '0' ? 'NO ASEGURADO' : 'ASEGURADO',
          value: codigo
        }));

        this.aplicarFiltros();
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar emergencias:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    const filtrados = this.registros.filter(r =>
      (!this.selectedCentro?.cod_centro || r.cod_centro === this.selectedCentro?.cod_centro) &&
      (!this.selectedPeriodo || r.periodo === this.selectedPeriodo) &&
      (!this.selectedTipoPaciente || r.cod_tipo_paciente === this.selectedTipoPaciente)
    );

    const grupos = new Map<string, EmergenciaResumen>();

    for (const r of filtrados) {
      const keyTipo = r.tipo;
      const keyGrupo = `${r.periodo}_${r.areas_emergencia}`;

      if (!grupos.has(keyTipo)) {
        grupos.set(keyTipo, {
          tipo: keyTipo,
          lista: [],
          total: 0
        });
      }

      const grupo = grupos.get(keyTipo)!;
      const existente = grupo.lista.find(i => i.periodo === r.periodo && i.area === r.areas_emergencia);

      if (existente) {
        existente.cantidad += r.cantidad;
      } else {
        grupo.lista.push({
          periodo: r.periodo,
          area: r.areas_emergencia,
          cantidad: r.cantidad
        });
      }

      grupo.total += r.cantidad;
    }

    this.tarjetas = Array.from(grupos.values()).sort((a, b) => a.tipo.localeCompare(b.tipo));
    this.tarjetas.sort((a, b) => {
      const indexA = this.tipoOrden.indexOf(a.tipo);
      const indexB = this.tipoOrden.indexOf(b.tipo);
      return indexA - indexB;
    });
  }

  limpiarFiltros(): void {
    this.selectedRed = null;
    this.selectedCentro = null;
    this.selectedPeriodo = '';
    this.selectedTipoPaciente = '';
    this.aplicarFiltros();
    this.messageService.add({
      severity: 'success',
      summary: 'Información',
      detail: 'Filtros Restablecidos',
    });
  }

  getTarjetasFiltradas(titulos: string[]): { tipo: string; lista: any[]; total: number }[] {
    const fuente = this.loading ? this.placeholders : this.tarjetas;
    return fuente.filter((t) => titulos.includes(t.tipo));
  }

  exportarTodos(): void {
    const registrosPlano = this.registros.map(r => ({
      Periodo: r.periodo,
      Centro: r.cod_centro,
      Tipo_Paciente: r.tipo_paciente,
      Prioridad: r.tipo,
      Área: r.areas_emergencia,
      Cantidad: r.cantidad
    }));

    const worksheet = XLSX.utils.json_to_sheet(registrosPlano);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Emergencias');
    XLSX.writeFile(workbook, 'emergencias_total.xlsx');
  }

}
