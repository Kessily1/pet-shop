import { Component, OnInit } from '@angular/core';
import { tutor } from '../../../api/tutor.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { tutorService } from '../../../service/tutor.service';

@Component({
    templateUrl: './tutor.component.html',
    providers: [MessageService]
})
export class TutorComponent implements OnInit {

    tutorDialog: boolean = false;

    deleteTutorDialog: boolean = false;

    deleteTutorsDialog: boolean = false;

    tutors: tutor[] = [];

    tutor: tutor = {};

    selectedTutors: tutor[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private tutorService: tutorService, private messageService: MessageService) { }

    ngOnInit() {
        this.tutorService.getTutors().subscribe(data => this.tutors = data);

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'phone', header: 'Phone' },
            { field: 'address', header: 'Address' }
        ];
    }

    openNew() {
        this.tutor = {};
        this.submitted = false;
        this.tutorDialog = true;
    }

    deleteSelectedTutors() {
        this.deleteTutorsDialog = true;
    }

    editTutor(tutor: tutor) {
        this.tutor = { ...tutor };
        this.tutorDialog = true;
    }

    deleteTutor(tutor: tutor) {
        this.deleteTutorDialog = true;
        this.tutor = { ...tutor };
    }
    
    confirmDeleteSelected() {
        this.deleteTutorsDialog = false;
        this.selectedTutors.forEach(tutor => {
            this.tutorService.deleteTutor(tutor.id).then(() => {
                this.tutors = this.tutors.filter(val => !this.selectedTutors.includes(val));
            });
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutors Deleted', life: 3000 });
        this.selectedTutors = [];
    }
    
    confirmDelete() {
        this.deleteTutorDialog = false;
        this.tutorService.deleteTutor(this.tutor.id).then(() => {
            this.tutors = this.tutors.filter(val => val.id !== this.tutor.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Deleted', life: 3000 });
            this.tutor = {};
        });
    }

    hideDialog() {
        this.tutorDialog = false;
        this.submitted = false;
    }

    saveTutor() {
        this.submitted = true;

        if (this.tutor.name?.trim()) {
            if (this.tutor.id) {
                this.tutorService.updateTutor(this.tutor.id, this.tutor).then(() => {
                    this.tutors[this.findIndexById(this.tutor.id)] = this.tutor;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Updated', life: 3000 });
                });
            } else {
                this.tutor.id = this.createId();
                this.tutorService.createTutor(this.tutor).then(() => {
                    this.tutors.push(this.tutor);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tutor Created', life: 3000 });
                });
            }

            this.tutors = [...this.tutors];
            this.tutorDialog = false;
            this.tutor = {};
        }
    }

    findIndexById(id: string): number {
        return this.tutors.findIndex(t => t.id === id);
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
