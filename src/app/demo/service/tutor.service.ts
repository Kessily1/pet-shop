import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tutor } from '../api/tutor.model';

@Injectable({
    providedIn: 'root'
})
export class tutorService {
    private basePath = "tutors";

    constructor(private db: AngularFireDatabase) { }

    createTutor(tutor: tutor): any {
        return this.db.list<tutor>(this.basePath).push(tutor);
    }

    getTutors(): Observable<tutor[]> {
        return this.db.list<tutor>(this.basePath).snapshotChanges().pipe(
            map(changes => 
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() as tutor }))
            )
        );
    }
    
    getTutorById(key: string): Observable<tutor> {
        return this.db.object<tutor>(`${this.basePath}/${key}`).valueChanges();
    }

    updateTutor(key: string, value: any): Promise<void> {
        return this.db.object<tutor>(`${this.basePath}/${key}`).update(value);
    } 
    
    deleteTutor(key: string): Promise<void> {
        return this.db.object<tutor>(`${this.basePath}/${key}`).remove();
    }
}
