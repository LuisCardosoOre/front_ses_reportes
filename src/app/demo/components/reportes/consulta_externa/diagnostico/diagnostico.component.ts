import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
import { DiagnosticoAgrupado, DiagnosticoOriginal, FilaDiagnosticoPlano, ServicioAgrupado, ServicioOriginal, Subactividad } from 'src/app/demo/api/cediagnostico.models';
import { Centro, Red } from 'src/app/demo/api/centros.models';
import { Agrupador, Especialidad, Variable } from 'src/app/demo/api/filtros.models';
import { ProduccionCeService } from 'src/app/demo/service/produccion-ce.service';


@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.scss']
})
export class DiagnosticoComponent implements OnInit {

  loading: boolean = false;
  expandedRows : { [key: string]: boolean } = {};
  expandedRowsDet  = {};

  meses: string[] = ['01', '02', '03', '04', '05', '06'];


  //filtros
  redes: Red[] = [];
  selectedRed: Red | null = null;
  selectedCentro: Centro | null = null;

  selectedAgrupador: string = '';
  selectedVariable: string = '';
  selectedEspecialidad: string = '';

  agrupador: Agrupador[] = [];
  variable: Variable[] = [];
  especialidad: Especialidad[] = [];

  filtros = {
    cod_red: null,
    cod_centro: null,
    cod_especialidad: null,
    cod_agrupador: null,
    cod_variable: null,
    tipo_paciente: null
  };

  datosOriginales: DiagnosticoOriginal[] = [];
  diagnosticos: DiagnosticoAgrupado[] = [];


  totalesMesDiagnostico: { [mes: string]: number } = {};;


  constructor(private cepService: ProduccionCeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      centros: this.cepService.getCentros(),
      variables: this.cepService.getVariable(),
      especialidad: this.cepService.getEspecialidad(),
      agrupador: this.cepService.getAgrupador()
    }).subscribe({
      next: ({ centros, variables, especialidad, agrupador }) => {
        this.redes = centros;
        this.variable = variables;
        this.especialidad = especialidad;
        this.agrupador = agrupador;
      },
      error: err => {
        console.error('Error en las llamadas:', err);
      }
    });



    this.cepService.getAllDiagnostico()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.datosOriginales = res;
          this.diagnosticos = this.agruparDiagnosticos(this.datosOriginales);

          // 🧠 Extraer todos los meses únicos desde subactividades
          const mesesSet = new Set<string>();

          this.diagnosticos.forEach(diag => {
            diag.servicios.forEach(serv => {
              serv.subactividades.forEach(sub => {
                Object.keys(sub.mensual).forEach(mes => mesesSet.add(mes));
              });
            });
          });

          this.meses = Array.from(mesesSet).sort();

          // 🔢 Calcular totales por mes usando función simplificada
          this.totalesMesDiagnostico = {};
          this.meses.forEach(mes => {
            this.totalesMesDiagnostico[mes] = this.calcularTotalMesDesdeSubactividades(
              this.diagnosticos.flatMap(d => d.servicios),
              mes
            );
          });


        },
        error: (err) => {
          console.error('Error al obtener datos :', err);
        }
      });

  }


  filtrarDiagnosticos() {
    const filtrados = this.datosOriginales.filter(item => {
      const f = this.filtros;

      const porCentro = this.selectedCentro?.cod_centro ? item.cod_centro === this.selectedCentro?.cod_centro : true;
      const porRed = this.selectedRed?.cod_red ? item.cod_red === this.selectedRed?.cod_red : true;

      const porEspecialidad = f.cod_especialidad ? item.cod_especialidad === f.cod_especialidad : true;
      const porAgrupador = f.cod_agrupador ? item.cod_agrupador === f.cod_agrupador : true;
      const porVariable = f.cod_variable ? item.cod_variable === f.cod_variable : true;
      const porPaciente = f.tipo_paciente ? item.tipo_paciente === f.tipo_paciente : true;

      return porCentro && porRed && porEspecialidad && porAgrupador && porVariable && porPaciente;
    });

    this.diagnosticos = this.agruparDiagnosticos(filtrados);
  }

  agruparDiagnosticos(data: DiagnosticoOriginal[]): DiagnosticoAgrupado[] {
    const map = new Map<string, DiagnosticoAgrupado>();

    data.forEach(item => {
      const cod = item.cod_diagnostico?.trim() || 'SIN DATOS';
      const desc = item.desc_diagnostico?.trim() || 'SIN DATOS';
      const key = `${cod}|${desc}`;

      if (!map.has(key)) {
        map.set(key, {
          cod_diagnostico: cod,
          desc_diagnostico: desc,
          servicios: this.agruparServicios(item.servicios),
          total_diagnostico: item.total_diagnostico
        });
      } else {
        const existente = map.get(key)!;
        existente.servicios.push(...this.agruparServicios(item.servicios));
        existente.total_diagnostico += item.total_diagnostico;
      }
    });

    map.forEach(d => {
      d.servicios = this.agruparServicios(d.servicios);
    });



    return Array.from(map.values()).sort((a, b) => a.cod_diagnostico.localeCompare(b.cod_diagnostico));
  }

  agruparServicios(servicios: ServicioOriginal[]): ServicioAgrupado[] {
    const map = new Map<string, ServicioAgrupado>();

    servicios.forEach(s => {
      const key = `${s.cod_servicio}|${s.desc_servicio}`;

      if (!map.has(key)) {
        map.set(key, {
          cod_servicio: s.cod_servicio,
          desc_servicio: s.desc_servicio,
          total_servicio: s.total_servicio,
          subactividades: [...s.subactividades],
          mensual: {}
        });
      } else {
        const actual = map.get(key)!;
        actual.subactividades.push(...s.subactividades);
        actual.total_servicio += s.total_servicio;
      }
    });

    map.forEach(serv => {
      serv.subactividades = this.agruparSubactividades(serv.subactividades);
      serv.mensual = {};
      serv.subactividades.forEach(sub => {
        for (const mes in sub.mensual) {
          serv.mensual[mes] = (serv.mensual[mes] || 0) + sub.mensual[mes];
        }
      });
    });

    return Array.from(map.values());
  }

  agruparSubactividades(subs: Subactividad[]): Subactividad[] {
    const map = new Map<string, Subactividad>();

    subs.forEach(sub => {
      const key = `${sub.cod_subactividad}|${sub.desc_subactividad}`;
      if (!map.has(key)) {
        map.set(key, {
          cod_subactividad: sub.cod_subactividad,
          desc_subactividad: sub.desc_subactividad,
          mensual: { ...sub.mensual },
          total_subactividad: sub.total_subactividad
        });
      } else {
        const actual = map.get(key)!;
        for (const mes in sub.mensual) {
          actual.mensual[mes] = (actual.mensual[mes] || 0) + sub.mensual[mes];
        }
        actual.total_subactividad += sub.total_subactividad;
      }
    });

    return Array.from(map.values());
  }

  limpiarFiltros() {
    this.selectedRed = null;
    this.selectedCentro = null;
    this.filtros = {
      cod_centro: null,
      cod_red: null,
      cod_especialidad: null,
      cod_agrupador: null,
      cod_variable: null,
      tipo_paciente: null
    };

    this.diagnosticos = this.agruparDiagnosticos(this.datosOriginales);
  }

  getTotalesMesDiagnostico(data: DiagnosticoAgrupado[]): { [mes: string]: number } {
    const totales: { [mes: string]: number } = {};

    data.forEach(diagnostico => {
      diagnostico.servicios.forEach(servicio => {
        for (const mes in servicio.mensual) {
          totales[mes] = (totales[mes] || 0) + servicio.mensual[mes];
        }
      });
    });

    return totales;
  }

  calcularTotalMesDesdeSubactividades(servicios: ServicioAgrupado[], mes: string): number {
    return servicios.reduce((acc, s) =>
      acc + s.subactividades.reduce((sum, sub) => sum + (sub.mensual?.[mes] ?? 0), 0),
      0);
  }

exportarSinAgrupar(): void {
  const filasExportar: FilaDiagnosticoPlano[] = [];

  this.datosOriginales.forEach(diagnostico => {
    const codDiag = diagnostico.cod_diagnostico?.trim() || 'SIN DATOS';
    const descDiag = diagnostico.desc_diagnostico?.trim() || 'SIN DATOS';

    diagnostico.servicios.forEach(servicio => {
      servicio.subactividades.forEach(sub => {
        Object.keys(sub.mensual).forEach(mes => {
          filasExportar.push({
            cod_diagnostico: codDiag,
            desc_diagnostico: descDiag,
            cod_servicio: servicio.cod_servicio,
            desc_servicio: servicio.desc_servicio,
            cod_subactividad: sub.cod_subactividad,
            desc_subactividad: sub.desc_subactividad,
            mes,
            cantidad: sub.mensual[mes],
            total_subactividad: sub.total_subactividad,
            total_servicio: servicio.total_servicio,
            tipo_paciente: diagnostico.tipo_paciente,
            cod_red: diagnostico.cod_red,
            cod_centro: diagnostico.cod_centro,
            cod_variable: diagnostico.cod_variable,
            cod_agrupador: diagnostico.cod_agrupador,
            cod_especialidad: diagnostico.cod_especialidad
          });
        });
      });
    });
  });

  // Exporta a Excel con xlsx
  import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(filasExportar);
    const workbook = { Sheets: { 'Diagnóstico Plano': worksheet }, SheetNames: ['Diagnóstico Plano'] };
    xlsx.writeFile(workbook, `diagnosticos-sin-agrupacion_${new Date().getTime()}.xlsx`);
  });
}  

expandAll(): void {
  this.expandedRows = {};

  this.diagnosticos.forEach(diag => {
    this.expandedRows[diag.desc_diagnostico] = true;
  });

}

collapseAll(): void {
  this.expandedRows = {};
}

}

