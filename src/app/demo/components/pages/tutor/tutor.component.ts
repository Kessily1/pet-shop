import { Component, OnInit } from '@angular/core';
import { tutor } from '../../../../demo/api/tutor.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { tutorService } from '../../../../demo/service/tutor.service';
import { CepService } from '../../../../demo/service/cep.service';


@Component({
    templateUrl: './tutor.component.html',
    providers: [MessageService]
})
export class TutorComponent implements OnInit {

    tutorDialog: boolean = false;

    deletetutorDialog: boolean = false;

    deletetutorsDialog: boolean = false;

    tutors: tutor[] = [];

    tutor: tutor = {};

    selectedtutors: tutor[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
    
    ufs: any = [] = [];

    municipios: any[] = [];

    constructor(private tutorService: tutorService, private messageService: MessageService, private cepService: CepService) { }


    ngOnInit() {
       this.cepService.buscaEstados().subscribe((ufs: any[])=> {
            this.ufs = ufs;
        })

        this.tutorService.getTutors().subscribe((tutors: any ) => {
            this.tutors = tutors;
            console.log(tutors)
        })

        this.cols = [
            this.cols = [
                { field: 'id', header: 'ID' },
                { field: 'name', header: 'Nome' },
                { field: 'nascimento', header: 'Data de Nascimento' },
                { field: 'CEP', header: 'CEP' },
                { field: 'estado', header: 'Estado' },
                { field: 'municipio', header: 'Município' },
        ]
        ]
       
        setTimeout(() => {
            console.log(this.tutors)
        }, 3000);

    }

    getCep(cep: any) {
        this.cepService.buscar(cep).subscribe(
            (cep: any) => { 
                this.tutor.logradouro = cep.logradouro;
                const estadoId = this.ufs.find((estado: any) => estado.sigla == cep.uf);
                this.tutor.estado = estadoId;
                this.getMunicipios(estadoId.id);
                setTimeout(() => {
                    const municipioId = this.municipios.find((cidade: any) => cidade.nome == cep.localidade);
                    this.tutor.municipio = municipioId;
                }, 500);
            }
        );
    }

    getMunicipios(code: string) {
        
        this.cepService.buscaMunicipios(code).subscribe(
            (municipios: any) => {
                this.municipios = municipios;
            }
        );
    }


    testUf(){
        console.log("municipio", this.tutor.municipio);
    }

    openNew() {
        this.tutor = {};
        this.submitted = false;
        this.tutorDialog = true;
    }

    deleteSelectedtutors() {
        this.deletetutorsDialog = true;
    }

    edittutor(tutor: tutor) {
        this.tutor = { ...tutor };
        this.tutorDialog = true;
    }

    deletetutor(tutor: tutor) {
        this.deletetutorDialog = true;
        console.log("Editando o tutor:", tutor);
        this.tutor = { ...tutor };
    }
    
    confirmDeleteSelected() {
        console.log("confirme tutor ",this.tutor)
        this.deletetutorsDialog = false;
        this.tutorService.deleteTutor(this.tutor.key);
        // this.tutors = this.tutors.filter(val => !this.selectedtutors.includes(val));
        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedtutors = [];
    }
    
    confirmDelete() {
        console.log("confirme tutor ",this.tutor)
        this.deletetutorDialog = false;
        // this.tutors = this.tutors.filter(val => val.id !== this.tutor.id);
        this.tutorService.deleteTutor(this.tutor.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'tutor Deleted', life: 3000 });
        this.tutor = {};
    }

    hideDialog() {
        this.tutorDialog = false;
        this.submitted = false;
    }

    Salvartutor() {
        this.submitted = true;

        if (this.tutor.name?.trim()) {
            if (this.tutor.id) {
                // @ts-ignore
                this.tutor.inventoryStatus = this.tutor.inventoryStatus ? this.tutor.inventoryStatus.value : 'INSTOCK';
                // this.tutors[this.findIndexById(this.tutor.id)] = this.tutor;
                this.tutorService.updateTutor(this.tutor.key, this.tutor);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'tutor Updated', life: 3000 });
            } else {
                this.tutor.id = this.createId();
               this.tutorService.createTutor(this.tutor);
                // @ts-ignore
                this.tutor.inventoryStatus = this.tutor.inventoryStatus ? this.tutor.inventoryStatus.value : 'INSTOCK';
                // this.tutors.push(this.tutor);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'tutor Created', life: 3000 });
            }

            this.tutors = [...this.tutors];
            this.tutorDialog = false;
            this.tutor = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tutors.length; i++) {
            if (this.tutors[i].id === id) {
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
