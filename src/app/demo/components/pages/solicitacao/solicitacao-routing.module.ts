import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SolicitacaoComponent } from './solicitacao.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SolicitacaoComponent }
	])],
	exports: [RouterModule]
})
export class SolicitacaoRoutingModule { }
