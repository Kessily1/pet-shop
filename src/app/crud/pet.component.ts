import { Component, OnInit } from '@angular/core';
import { PetService, Pet } from './pet.service';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements OnInit {

  pets: Pet[] = [];
  pet: Pet = { nome: '', especie: '', idade: 0, dataNascimento: new Date(), peso: 0, cor: '', sexo: 'Masculino' };

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.getAllPets();
  }

  // 1. Criar um pet
  addPet(): void {
    this.petService.addPet(this.pet).then(() => {
      console.log('Pet adicionado com sucesso!');
      this.getAllPets();  // Atualiza a lista de pets
    }).catch(err => console.error('Erro ao adicionar pet:', err));
  }

  // 2. Obter todos os pets
  getAllPets(): void {
    this.petService.getPets().subscribe(pets => {
      this.pets = pets;
      console.log('Pets carregados:', pets);
    });
  }

  // 3. Atualizar um pet
  updatePet(id: string): void {
    const petAtualizado: Pet = { ...this.pet, nome: 'Nome Atualizado' };  // Exemplo de atualização
    this.petService.updatePet(id, petAtualizado).then(() => {
      console.log('Pet atualizado com sucesso!');
      this.getAllPets();  // Atualiza a lista de pets
    }).catch(err => console.error('Erro ao atualizar pet:', err));
  }

  // 4. Deletar um pet
  deletePet(id: string): void {
    this.petService.deletePet(id).then(() => {
      console.log('Pet deletado com sucesso!');
      this.getAllPets();  // Atualiza a lista de pets
    }).catch(err => console.error('Erro ao deletar pet:', err));
  }

  // 5. Obter um pet específico
  getPet(id: string): void {
    this.petService.getPetById(id).subscribe(pet => {
      console.log('Pet encontrado:', pet);
    });
  }
}
