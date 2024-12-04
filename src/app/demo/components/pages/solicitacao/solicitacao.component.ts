import { Component, OnInit } from '@angular/core';
import { solicitacao } from '../../../api/solicitacao.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { solicitacaoService } from '../../../service/solicitacao.service';

@Component({
    templateUrl: './solicitacao.component.html',
     styleUrls: ['./solicitacao.component.scss'], 
    providers: [MessageService]
})
export class SolicitacaoComponent implements OnInit {

    solicitacaoDialog: boolean = false;

    deletesolicitacaoDialog: boolean = false;

    deleteSolicitacoesDialog: boolean = false;

    Solicitacoes: solicitacao[] = [];

    solicitacao: solicitacao = {};

    selectedSolicitacoes: solicitacao[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private solicitacaoService: solicitacaoService, private messageService: MessageService) { }

    ngOnInit() {
        this.solicitacaoService.getSolicitacaos().subscribe(data => this.Solicitacoes = data);


        this.cols = [
            { field: 'product', header: 'solicitacao' },
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
            console.log(this.Solicitacoes)
        }, 3000);

    }

    openNew() {
        this.solicitacao = {};
        this.submitted = false;
        this.solicitacaoDialog = true;
    }

    deleteSelectedSolicitacoes() {
        this.deleteSolicitacoesDialog = true;
    }

    editSolicitacao(solicitacao: solicitacao) {
        this.solicitacao = { ...solicitacao };
        this.solicitacaoDialog = true;
    }

    deleteSolicitacao(solicitacao: solicitacao) {
        this.deletesolicitacaoDialog = true;
        console.log("Editando o solicitacao:", solicitacao);
        this.solicitacao = { ...solicitacao };
    }
    
    confirmDeleteSelected() {
        console.log("confirme solicitacao ",this.solicitacao)
        this.deleteSolicitacoesDialog = false;
        this.solicitacaoService.deleteSolicitacao(this.solicitacao.key);
        // this.Solicitacoes = this.Solicitacoes.filter(val => !this.selectedSolicitacoes.includes(val));
        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedSolicitacoes = [];
    }
    
    confirmDelete() {
        console.log("confirme solicitacao ",this.solicitacao)
        this.deletesolicitacaoDialog = false;
        // this.Solicitacoes = this.Solicitacoes.filter(val => val.id !== this.solicitacao.id);
        this.solicitacaoService.deleteSolicitacao(this.solicitacao.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'solicitacao Deleted', life: 3000 });
        this.solicitacao = {};
    }

    hideDialog() {
        this.solicitacaoDialog = false;
        this.submitted = false;
    }

    savesolicitacao() {
        this.submitted = true;

        if (this.solicitacao.name?.trim()) {
            if (this.solicitacao.id) {
                // @ts-ignore
                this.solicitacao.inventoryStatus = this.solicitacao.inventoryStatus ? this.solicitacao.inventoryStatus.value : 'INSTOCK';
                // this.Solicitacoes[this.findIndexById(this.solicitacao.id)] = this.solicitacao;
                this.solicitacaoService.updateSolicitacao(this.solicitacao.key, this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'solicitacao Updated', life: 3000 });
            } else {
                this.solicitacao.id = this.createId();
               this.solicitacaoService.createSolicitacao(this.solicitacao);
                // @ts-ignore
                this.solicitacao.inventoryStatus = this.solicitacao.inventoryStatus ? this.solicitacao.inventoryStatus.value : 'INSTOCK';
                // this.solicitacaos.push(this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'solicitacao Created', life: 3000 });
            }

            this.Solicitacoes = [...this.Solicitacoes];
            this.solicitacaoDialog = false;
            this.solicitacao = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.Solicitacoes.length; i++) {
            if (this.Solicitacoes[i].id === id) {
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
