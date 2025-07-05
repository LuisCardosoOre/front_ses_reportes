import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', component: NotfoundComponent},
                    { path: 'produccion', loadChildren: () => import('./demo/components/page/page.module').then(m => m.PageModule) },
                    { path: 'reportes', loadChildren: () => import('./demo/components/reportes/reportes.module').then(m => m.ReportesModule)  },
                    { path: 'documentation', component: NotfoundComponent },
                    { path: 'pages', component: NotfoundComponent }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
