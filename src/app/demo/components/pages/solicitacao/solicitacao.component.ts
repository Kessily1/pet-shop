import { Component, OnInit } from '@angular/core';
import { solicitacao } from '../../../api/solicitacao.model';
import { Pet } from '../../../api/pet.model'; 
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { solicitacaoService } from '../../../service/solicitacao.service';
import { PetService } from '../../../service/pet.service';

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

    pets: Pet[] = []; // Armazena os pets carregados
    selectedPet: Pet | null = null; // Pet selecionado no formulário

    constructor(
        private solicitacaoService: solicitacaoService,
        private petService: PetService, // Injeta o serviço de Pets
        private messageService: MessageService
    ) { }

    ngOnInit() {
        // Carrega as solicitações
        this.solicitacaoService.getSolicitacaos().subscribe(data => this.Solicitacoes = data);

        // Carrega os últimos pets
        this.loadLastPets();

        // Define as colunas da tabela
        this.cols = [
            { field: 'product', header: 'Solicitação' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        // Define os status de inventário
        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    // Carrega os últimos pets registrados
    loadLastPets() {
        this.petService.getLastPets(5).subscribe(data => {
            this.pets = data;
        });
    }

    // Quando um pet é selecionado no formulário
    onPetSelect(pet: Pet) {
        this.selectedPet = pet;
        console.log('Pet selecionado:', pet);
    }

    // Funções do CRUD de Solicitações
    openNew() {
        this.solicitacao = {};
        this.selectedPet = null; // Reseta o pet selecionado
        this.submitted = false;
        this.solicitacaoDialog = true;
    }

    saveSolicitacao() {
        this.submitted = true;

        if (this.solicitacao.nome?.trim()) {
            if (this.solicitacao.id) {
                this.solicitacaoService.updateSolicitacao(this.solicitacao.key, this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Updated', life: 3000 });
            } else {
                this.solicitacao.id = this.createId();
                this.solicitacaoService.createSolicitacao(this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Created', life: 3000 });
            }

            // Associa o pet selecionado à solicitação
            if (this.selectedPet) {
                this.solicitacao.Pet = this.selectedPet;
            }

            this.Solicitacoes = [...this.Solicitacoes];
            this.solicitacaoDialog = false;
            this.solicitacao = {};
        }
    }

    editsolicitacao(solicitacao: solicitacao) {
        this.solicitacao = { ...solicitacao };
        this.selectedPet = solicitacao.Pet || null;
        this.solicitacaoDialog = true;
    }

    deletesolicitacao(solicitacao: solicitacao) {
        this.solicitacao = solicitacao;
        this.deletesolicitacaoDialog = true;
    }

    confirmDelete() {
        this.Solicitacoes = this.Solicitacoes.filter(val => val.id !== this.solicitacao.id);
        this.solicitacaoService.deleteSolicitacao(this.solicitacao.id!);
        this.solicitacao = {};
        this.deletesolicitacaoDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Deleted', life: 3000 });
    }

    hideDialog() {
        this.solicitacaoDialog = false;
        this.deletesolicitacaoDialog = false;
        this.deleteSolicitacoesDialog = false;
        this.submitted = false;
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
