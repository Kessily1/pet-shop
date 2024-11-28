import { Component, OnInit } from '@angular/core';
import { Servico } from '../../../../demo/api/servico.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ServicoService } from '../../../../demo/service/servico.service';

@Component({
    templateUrl: './servico.component.html',
    providers: [MessageService]
})
export class ServicoComponent implements OnInit {

    servicoDialog: boolean = false;

    deleteServicoDialog: boolean = false;

    deleteServicosDialog: boolean = false;

    Servicos: Servico[] = [];

    servico: Servico = {};

    selectedServicos: Servico[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private ServicoService: ServicoService, private messageService: MessageService) { }

    ngOnInit() {
        this.ServicoService.getServicos().subscribe(data => this.Servicos = data);


        this.cols = [
            { field: 'product', header: 'servico' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
        setTimeout(() => {
            console.log(this.Servicos)
        }, 3000);

    }

    openNew() {
        this.servico = {};
        this.submitted = false;
        this.servicoDialog = true;
    }

    deleteSelectedServicos() {
        this.deleteServicosDialog = true;
    }

    editservico(servico: Servico) {
        this.servico = { ...servico };
        this.servicoDialog = true;
    }

    deleteservico(servico: Servico) {
        this.deleteServicoDialog = true;
        console.log("Editando o servico:", servico);
        this.servico = { ...servico };
    }
    
    confirmDeleteSelected() {
        console.log("confirme servico ",this.servico)
        this.deleteServicosDialog = false;
        this.ServicoService.deleteServico(this.servico.key);
        // this.Servicos = this.Servicos.filter(val => !this.selectedServicos.includes(val));
        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedServicos = [];
    }
    
    confirmDelete() {
        console.log("confirme servico ",this.servico)
        this.deleteServicoDialog = false;
        // this.Servicos = this.Servicos.filter(val => val.id !== this.servico.id);
        this.ServicoService.deleteServico(this.servico.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'servico Deleted', life: 3000 });
        this.servico = {};
    }

    hideDialog() {
        this.servicoDialog = false;
        this.submitted = false;
    }

    saveServico() {
        this.submitted = true;

        if (this.servico.name?.trim()) {
            if (this.servico.id) {
                // @ts-ignore
                this.servico.inventoryStatus = this.servico.inventoryStatus ? this.servico.inventoryStatus.value : 'INSTOCK';
                // this.Servicos[this.findIndexById(this.servico.id)] = this.servico;
                this.ServicoService.updateServico(this.servico.key, this.servico);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'servico Updated', life: 3000 });
            } else {
                this.servico.id = this.createId();
               this.ServicoService.createServico(this.servico);
                // @ts-ignore
                this.servico.inventoryStatus = this.servico.inventoryStatus ? this.servico.inventoryStatus.value : 'INSTOCK';
                // this.Servicos.push(this.servico);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'servico Created', life: 3000 });
            }

            this.Servicos = [...this.Servicos];
            this.servicoDialog = false;
            this.servico = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.Servicos.length; i++) {
            if (this.Servicos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
