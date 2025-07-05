import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
import { Centro, Red } from 'src/app/demo/api/centros.models';
import { AgrupadoProduccionCE, ProduccionCE, Subactividad } from 'src/app/demo/api/ceproduccion.models';
import { Agrupador, Especialidad, Variable } from 'src/app/demo/api/filtros.models';
import { ProduccionCeService } from 'src/app/demo/service/produccion-ce.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit {

  loading: boolean = false;
  expandedRows = {};

  meses: string[] = ['01', '02', '03', '04', '05'];
  lstServicios: AgrupadoProduccionCE[] = [];
  lst: ProduccionCE[] = [];

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
      next: ({ centros, variables,especialidad,agrupador }) => {
        this.redes = centros;
        this.variable = variables;
        this.especialidad = especialidad;
        this.agrupador =agrupador;
      },
      error: err => {
        console.error('Error en las llamadas:', err);
      }
    });



    this.cepService.getAllProduccion()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.lst = res;
          this.lstServicios = this.agruparServicios(this.lst);
          this.meses = this.getMesesDesdeDatos(this.lst);
        },
        error: (err) => {
          console.error('Error al obtener datos :', err);
        }
      });


  }

  calcularTotalMes(subs: Subactividad[], mes: string): number {
    return subs.reduce((acc, s) => acc + (s.mensual[mes] || 0), 0);
  }


  agruparServicios(dataOriginal: ProduccionCE[]): AgrupadoProduccionCE[] {
    const agrupadoMap = new Map<string, AgrupadoProduccionCE>();

    for (const item of dataOriginal) {
      const key = `${item.cod_servicio}|${item.desc_servicio}`;

      if (!agrupadoMap.has(key)) {
        agrupadoMap.set(key, {
          cod_servicio: item.cod_servicio,
          desc_servicio: item.desc_servicio,
          subactividades: [...item.subactividades], // agruparemos luego
          mensual: {},
          total_servicio: item.total_servicio
        });
      } else {
        const agrupado = agrupadoMap.get(key)!;
        agrupado.subactividades.push(...item.subactividades);
        agrupado.total_servicio += item.total_servicio;
      }
    }

    // Agrupar subactividades dentro de cada grupo de servicio
    agrupadoMap.forEach(servicio => {
      servicio.subactividades = this.agruparSubactividades(servicio.subactividades);

      // Calcular mensual por grupo de servicio
      servicio.mensual = {};
      for (const sub of servicio.subactividades) {
        for (const mes in sub.mensual) {
          servicio.mensual[mes] = (servicio.mensual[mes] || 0) + sub.mensual[mes];
        }
      }
    });

    return Array.from(agrupadoMap.values());
  }

  agruparSubactividades(subs: Subactividad[]): Subactividad[] {
    const map = new Map<string, Subactividad>();

    for (const sub of subs) {
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
    }

    return Array.from(map.values());
  }

  filtrarServicios() {
    const filtrados = this.lst.filter(item => {
      const coincideCentro = this.selectedCentro?.cod_centro  ? item.cod_centro === this.selectedCentro?.cod_centro : true;
      const coincideRed = this.selectedRed?.cod_red ? item.cod_red === this.selectedRed?.cod_red : true;
      const coincideEspecialidad = this.filtros.cod_especialidad ? item.cod_especialidad === this.filtros.cod_especialidad : true;
      const coincideAgrupador = this.filtros.cod_agrupador ? item.cod_agrupador === this.filtros.cod_agrupador : true;
      const coincideVariable = this.filtros.cod_variable ? item.cod_variable === this.filtros.cod_variable : true;
      const coincidePaciente = this.filtros.tipo_paciente ? item.tipo_paciente === this.filtros.tipo_paciente : true;

      return coincideCentro &&
        coincideRed &&
        coincideEspecialidad &&
        coincideAgrupador &&
        coincideVariable &&
        coincidePaciente;
    });

    // Agrupamos después del filtrado
    this.lstServicios = this.agruparServicios(filtrados);
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

    this.lstServicios = this.agruparServicios(this.lst);
  }


  getMesesDesdeDatos(datos: ProduccionCE[]): string[] {
  const mesesSet = new Set<string>();

  datos.forEach(servicio => {
    servicio.subactividades.forEach(sub => {
      Object.keys(sub.mensual).forEach(mes => {
        mesesSet.add(mes);
      });
    });
  });

  // Ordenar los meses
  return Array.from(mesesSet).sort(); // ['01', '02', '03', ..., '12']
}

exportarServiciosOriginalesCompleto(): void {
  const filasExportar: any[] = [];

  this.lst.forEach(servicio => {
    servicio.subactividades.forEach(sub => {
      Object.keys(sub.mensual).forEach(mes => {
        filasExportar.push({
          cod_servicio: servicio.cod_servicio,
          desc_servicio: servicio.desc_servicio,
          cod_subactividad: sub.cod_subactividad,
          desc_subactividad: sub.desc_subactividad,
          mes,
          cantidad: sub.mensual[mes],
          total_subactividad: sub.total_subactividad,
          total_servicio: servicio.total_servicio,

          // 🔄 campos adicionales si vienen del backend
          tipo_paciente: servicio.tipo_paciente || '',
          cod_centro: servicio.cod_centro || '',
          cod_red: servicio.cod_red || '',
          cod_variable: servicio.cod_variable || '',
          cod_agrupador: servicio.cod_agrupador || '',
          cod_especialidad: servicio.cod_especialidad || ''
        });
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(filasExportar);
  const workbook = { Sheets: { 'Servicios Completos' : worksheet }, SheetNames: ['Servicios Completos'] };
  XLSX.writeFile(workbook, `servicios-originales-completos_${new Date().getTime()}.xlsx`);
}

}
