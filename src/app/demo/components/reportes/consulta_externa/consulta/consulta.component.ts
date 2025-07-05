import { Component, OnInit } from '@angular/core';
import { AgrupadoCE, ConsultaCE } from 'src/app/demo/api/consultace.models';
import { ConsultasCeService } from 'src/app/demo/service/consultas_ce.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
import { Console } from 'console';
import { Centro, Red } from 'src/app/demo/api/centros.models';
import { TarjetaCE } from 'src/app/demo/api/tarjetasCE.models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
})
export class ConsultaComponent implements OnInit {
  loading: boolean = false;
  readonly placeholders = Array.from({ length: 8 }, (_, i) => ({
    titulo: `Cargando ${i + 1}`,
    lista: [],
    total: 0,
  }));

  // Listas 
  registros: ConsultaCE[] = [];
  variablesUnicas: string[] = [];
  tarjetas: { titulo: string; lista: AgrupadoCE[]; total: number }[] = [];
  //filtros
  redes: Red[] = [];
  selectedRed: Red | null = null;
  selectedCentro: Centro | null = null;
  selectedPeriodo: string = '';
  tipoAseguradoSeleccionado: string = '';
  periodos: string[] = [];
  tiposAsegurado: string[] = [];

  constructor(
    private apiService: ConsultasCeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.apiService.getCentros().subscribe({
      next: (res) => {
        this.redes = res;
      },
      error: (err) => {
        console.error('Error al obtener datos Red:', err);
      },
    });

    this.apiService.getSES().subscribe({
      next: (data: ConsultaCE[]) => {
        this.registros = data;

        const todos = data;
        this.periodos = [...new Set(
          todos.map(d => d.periodo).filter(p => p != null && p.trim() !== '')
        )].sort();

        this.tiposAsegurado = [...new Set(
          todos.map(d => d.tipo_paciente).filter(tp => tp != null && tp.trim() !== '')
        )].sort();

        this.variablesUnicas = [...new Set(
          todos.map(d => d.variable).filter(v => v != null && v.trim() !== '')
        )].sort();

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos SES:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    const centro = this.selectedCentro?.cod_centro || '';
    const periodo = this.selectedPeriodo;
    const tipoAseg = this.tipoAseguradoSeleccionado;

    this.tarjetas = this.variablesUnicas.map(variable => {
      const filtrados = this.registros.filter(x =>
        x.variable === variable &&
        (!centro || x.cod_centro === centro) &&
        (!periodo || x.periodo === periodo) &&
        (!tipoAseg || x.tipo_paciente === tipoAseg)
      );

      const mapa = new Map<string, AgrupadoCE>();

      for (let item of filtrados) {
        const key = `${item.periodo}_${item.agrupador}`;
        if (!mapa.has(key)) {
          mapa.set(key, { periodo: item.periodo, tipo: item.agrupador, cantidad: item.cantidad });
        } else {
          mapa.get(key)!.cantidad += item.cantidad;
        }
      }

      const lista = Array.from(mapa.values()).sort((a, b) => a.periodo.localeCompare(b.periodo));
      const total = lista.reduce((sum, r) => sum + r.cantidad, 0);

      return {
        titulo: variable.charAt(0).toUpperCase() + variable.slice(1).toLowerCase(), // Ej. "Servicio"
        lista,
        total
      };
    });
  }

  limpiarFiltros(): void {
    this.selectedRed = null;
    this.selectedCentro = null;
    this.selectedPeriodo = '';
    this.tipoAseguradoSeleccionado = '';
    this.aplicarFiltros();
    this.messageService.add({
      severity: 'success',
      summary: 'Información',
      detail: 'Filtros Restablecidos',
    });
  }

  getTarjetasFiltradas(titulos: string[]): { titulo: string; lista: any[]; total: number }[] {
    const fuente = this.loading ? this.placeholders : this.tarjetas;
    return fuente.filter((t) => titulos.includes(t.titulo));
  }

  exportarTodosRegistros(): void {
  if (!this.registros || this.registros.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(this.registros);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Todos los Registros');

  XLSX.writeFile(workbook, `consulta_externa_completa_${new Date().getTime()}.xlsx`);
}

}