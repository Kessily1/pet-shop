import { Component, OnInit } from '@angular/core';
import { solicitacao } from '../../../api/solicitacao.model';
import { Pet } from '../../../api/pet.model';
import { Servico } from '../../../api/servico.model';  
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { solicitacaoService } from '../../../service/solicitacao.service';
import { PetService } from '../../../service/pet.service';
import { tutorService } from '../../../service/tutor.service'; 
import { ServicoService } from '../../../service/servico.service'; 

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

    pets: Pet[] = []; 
    selectedPet: Pet | null = null; 

    tutors: any[] = [];  
    selectedTutor: string | null = null; 

    servicos: Servico[] = [];  
    selectedServico: string | null = null;  

    constructor(
        private solicitacaoService: solicitacaoService,
        private petService: PetService, 
        private tutorService: tutorService, 
        private ServicoService: ServicoService, 
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.solicitacaoService.getSolicitacaos().subscribe(data => this.Solicitacoes = data);

        this.loadLastPets();

        this.loadTutors();

        this.loadServicos();

        this.cols = [
            { field: 'product', header: 'Solicitação' },
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
    }

    loadLastPets() {
        this.petService.getLastPets(5).subscribe(data => {
            this.pets = data;
        });
    }

    loadTutors() {
        this.tutorService.getTutors().subscribe(data => {
            this.tutors = data;
        });
    }

    loadServicos() {
        this.ServicoService.getServicos().subscribe(data => {
            this.servicos = data;
        });
    }

    onPetSelect(pet: Pet) {
        this.selectedPet = pet;
        console.log('Pet selecionado:', pet);
    }

    onTutorSelect(tutorId: string) {
        this.selectedTutor = tutorId;
        console.log('Tutor selecionado:', tutorId);
    }

    onServicoSelect(servicoId: string) {
        this.selectedServico = servicoId;
        console.log('Serviço selecionado:', servicoId);
    }

    openNew() {
        this.solicitacao = {};
        this.selectedPet = null; 
        this.selectedTutor = null; 
        this.selectedServico = null; 
        this.submitted = false;
        this.solicitacaoDialog = true;
    }

    saveSolicitacao() {
        this.submitted = true;

        if (this.solicitacao.nome?.trim()) {
            if (this.solicitacao.id) {
                this.solicitacaoService.updateSolicitacao(this.solicitacao.key, this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Atualizada', life: 3000 });
            } else {
                this.solicitacao.id = this.createId();
                this.solicitacaoService.createSolicitacao(this.solicitacao);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Criada', life: 3000 });
            }

            if (this.selectedPet) {
                this.solicitacao.Pet = this.selectedPet;
            }
            if (this.selectedTutor) {
                this.solicitacao.tutor = this.selectedTutor;
            }
            if (this.selectedServico) {
                this.solicitacao.servico = this.selectedServico;
            }

            this.Solicitacoes = [...this.Solicitacoes];
            this.solicitacaoDialog = false;
            this.solicitacao = {};
        }
    }

    editsolicitacao(solicitacao: solicitacao) {
        this.solicitacao = { ...solicitacao };
        this.selectedPet = solicitacao.Pet || null;
        this.selectedTutor = solicitacao.tutor || null;
        this.selectedServico = solicitacao.servico || null;
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
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Solicitação Deletada', life: 3000 });
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
