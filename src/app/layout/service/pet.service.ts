import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface para tipar os dados do Pet
export interface Pet {
  nome: string;
  especie: string;
  idade: number;
  dataNascimento: any;
  peso: number;
  cor: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
}

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private petsCollection = this.firestore.collection<Pet>('pets');

  constructor(private firestore: AngularFirestore) { }

  // 1. Criar ou adicionar um novo pet
  addPet(pet: Pet): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('pets').doc(id).set(pet);
  }

  // 2. Obter todos os pets (Ler)
  getPets(): Observable<Pet[]> {
    return this.firestore.collection('pets').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Pet;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // 3. Atualizar um pet
  updatePet(id: string, pet: Pet): Promise<void> {
    return this.firestore.collection('pets').doc(id).update(pet);
  }

  // 4. Deletar um pet
  deletePet(id: string): Promise<void> {
    return this.firestore.collection('pets').doc(id).delete();
  }

  // 5. Obter um pet específico
  getPetById(id: string): Observable<Pet> {
    return this.firestore.collection('pets').doc(id).valueChanges() as Observable<Pet>;
  }
}
