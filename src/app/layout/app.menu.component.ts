import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Seguridad',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', routerLink: ['/auth/login'] }
                ]
            },
            {
                label: 'Producción',
                items: [
                    { label: 'Consulta Externa', icon: 'pi pi-fw pi-id-card', routerLink: ['/produccion/consulta-externa'] },
                    { label: 'Emergencia', icon: 'pi pi-fw pi-bookmark', routerLink: ['/produccion/emergencia'] },
                    { label: 'Hospitalizacion', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/produccion/hospitalizacion'] }

                ]
            },
            {
                label: 'Reportes',
                items: [
                    { label: 'Consulta Médica - C.E.', icon: 'pi pi-fw pi-id-card', routerLink: ['/reportes/consulta-medica'] },
                    { label: 'Producción - C.E.', icon: 'pi pi-fw pi-id-card', routerLink: ['/reportes/produccion'] },
                    { label: 'Diagnostico - C.E.', icon: 'pi pi-fw pi-id-card', routerLink: ['/reportes/diagnostico'] },
                    { label: 'Homologada - C.E.', icon: 'pi pi-fw pi-id-card', routerLink: ['/reportes/homologadas-ce'] }
                ]
            }
        ];
    }
}
