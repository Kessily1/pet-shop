import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'tutor', loadChildren: () => import('./tutor/tutor.module').then(m => m.tutorModule) },
        { path: 'servico', loadChildren: () => import('./servico/servico.module').then(m => m.ServicoModule) },
        { path: 'solicitacao', loadChildren: () => import('./solicitacao/solicitacao.module').then(m => m.SolicitacaoModule) },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
