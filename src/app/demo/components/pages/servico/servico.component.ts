import { Component, OnInit } from '@angular/core';
import { Servico } from '../../../../demo/api/servico.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ServicoService } from '../../../../demo/service/servico.service';

@Component({
    templateUrl: './servico.component.html',
    styleUrls: ['./servico.component.scss'], 

    providers: [MessageService]
})
export class ServicoComponent implements OnInit {

    duracao: number = 0;

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
        console.log('Antes de salvar, servico:', this.servico);
        if (this.servico.nome?.trim()) {
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

    adjustHeight(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto'; // Reseta a altura
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta para o conteúdo
    }

    convertToMinutes() {
        // Verifica se duracao é um número ou string
        if (this.servico.duracao && (typeof this.servico.duracao === 'string' || typeof this.servico.duracao === 'number')) {
            // Converte duracao para string se for número
            const duracaoString = this.servico.duracao.toString();
    
            const regexHora = /(\d+)\s*(hora|horas)/i;
            const regexMinuto = /(\d+)\s*(minuto|minutos)/i;
    
            const horaMatch = duracaoString.match(regexHora);
            const minutoMatch = duracaoString.match(regexMinuto);
    
            let duracaoEmMinutos = 0;
    
            // Se encontrou uma expressão com 'hora' ou 'horas'
            if (horaMatch) {
                const horas = parseInt(horaMatch[1], 10);
                duracaoEmMinutos += horas * 60;
            }
    
            // Se encontrou uma expressão com 'minuto' ou 'minutos'
            if (minutoMatch) {
                const minutos = parseInt(minutoMatch[1], 10);
                duracaoEmMinutos += minutos;
            }
    
            // Salva a duração em minutos
            if (duracaoEmMinutos > 0) {
                this.servico.duracao = duracaoEmMinutos; // Agora armazenamos o valor como número
                console.log(`Duração convertida: ${duracaoEmMinutos} minutos`);
            } else {
                alert('Por favor, insira uma duração válida (ex: 1 hora, 30 minutos)');
                this.servico.duracao = 0; 
            }
        } 
    }
    
    
    
    
}
