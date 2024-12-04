import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { solicitacao } from '../api/solicitacao.model';

@Injectable({
    providedIn: 'root'
})
export class solicitacaoService {
    private basePath = "Solicitacões";

    constructor(private db: AngularFireDatabase) { }

    createSolicitacao(solicitacao: solicitacao): any {
        return this.db.list<solicitacao>(this.basePath).push(solicitacao);
    }

    getSolicitacaos(): Observable<solicitacao[]> {
        return this.db.list<solicitacao>(this.basePath).snapshotChanges().pipe(
            map(changes => 
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() as solicitacao }))
            )
        );
    }
    
    getSolicitacaoById(key: string): Observable<solicitacao> {
        return this.db.object<solicitacao>(`${this.basePath}/${key}`).valueChanges();
    }

    updateSolicitacao(key: string, value: any): Promise<void> {
        return this.db.object<solicitacao>(`${this.basePath}/${key}`).update(value);
    } 
    
    deleteSolicitacao(key: string): Promise<void> {
        return this.db.object<solicitacao>(`${this.basePath}/${key}`).remove();
    }
}
