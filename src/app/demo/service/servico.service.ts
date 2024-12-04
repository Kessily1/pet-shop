import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Servico } from '../api/servico.model.js';

@Injectable({
    providedIn: 'root'
})
export class ServicoService {
    private basePath = "servicos"


    constructor(private db: AngularFireDatabase) { }

   

    createServico(pet: Servico): any {
        return this.db.list<Servico>(this.basePath).push(pet);
    }
    getServicos() {
        return this.db.list<Servico>(this.basePath).snapshotChanges().pipe(
            map(changes => 
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    } 
    
    getServicoId(key: string): Observable<Servico> {
        return this.db.object<Servico>(`${this.basePath}/${key}`).valueChanges();
    }

    updateServico(key: string, value: any): Promise<void>{
        return this.db.object<Servico>(`${this.basePath}/${key}`).update(value);
    } 
    
    deleteServico(key: string): Promise<void> {
        return this.db.object<Servico>(`${this.basePath}/${key}`).remove(); 
     }
}
