import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicoComponent } from './servico.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ServicoComponent }
	])],
	exports: [RouterModule]
})
export class ServicoRoutingModule { }