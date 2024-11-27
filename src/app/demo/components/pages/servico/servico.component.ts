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

    servicos: Servico[] = [];

    servico: Servico = {};

    selectedServicos: Servico[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private servicoService: ServicoService, private messageService: MessageService) { }

    ngOnInit() {
        this.servicoService.getServicos().subscribe(data => this.servicos = data);


        this.cols = [
            { field: 'servicos', header: 'Servico' },
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
            console.log(this.servicos)
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

    editServico(servico: Servico) {
        this.servico = { ...servico };
        this.servicoDialog = true;
    }

    deleteServico(servico: Servico) {
        this.deleteServicoDialog = true;
        console.log("Editando o servico:", servico);
        this.servico = { ...servico };
    }
    
    confirmDeleteSelected() {
        console.log("confirme servico ",this.servico)
        this.deleteServicosDialog = false;
        this.servicoService.deleteServico(this.servico.key);
        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedServicos = [];
    }
    
    confirmDelete() {
        console.log("confirme servico ",this.servico)
        this.deleteServicoDialog = false;
        // this.pets = this.pets.filter(val => val.id !== this.servico.id);
        this.servicoService.deleteServico(this.servico.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Servico Deleted', life: 3000 });
        this.servico = {};
    }

    hideDialog() {
        this.servicoDialog = false;
        this.submitted = false;
    }

    savePet() {
        this.submitted = true;

        if (this.servico.name?.trim()) {
            if (this.servico.id) {
                // @ts-ignore
                this.servico.inventoryStatus = this.servico.inventoryStatus ? this.servico.inventoryStatus.value : 'INSTOCK';
                // this.pets[this.findIndexById(this.servico.id)] = this.servico;
                this.servicoService.updateServico(this.servico.key, this.servico);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Servico Updated', life: 3000 });
            } else {
                this.servico.id = this.createId();
               this.servicoService.createServico(this.servico);
                // @ts-ignore
                this.servico.inventoryStatus = this.servico.inventoryStatus ? this.servico.inventoryStatus.value : 'INSTOCK';
                // this.pets.push(this.servico);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Servico Created', life: 3000 });
            }

            this.servicos = [...this.servicos];
            this.servicoDialog = false;
            this.servico = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.servicos.length; i++) {
            if (this.servico[i].id === id) {
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
