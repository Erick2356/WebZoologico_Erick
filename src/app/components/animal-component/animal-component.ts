import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal-service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './animal-component.html',
  styleUrls: ['./animal-component.css'],
})
export class AnimalComponent {
  animalList: any = [];
  animalForm: FormGroup | any;
  editableAnimal = false;
  idAnimal: string | null = null;

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      edad: [0, Validators.required],
      tipo: ['', Validators.required],
    });
    this.getAllAnimals();
  }

  // Obtener lista completa
  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: any) => {
      this.animalList = data;
    });
  }

  // Mostrar mensaje tipo toast
  newMessage(messageText: string) {
    this.toastr.success('¡Clic aquí para actualizar la lista!', messageText);
  }

  // Registrar nuevo animal
  newAnimalEntry() {
    if (!this.animalForm.valid) return;

    const animalData = {
      ...this.animalForm.value,
      fecha: new Date(),
    };

    console.log('📤 Enviando datos:', animalData);

    this.animalService.newAnimal(animalData).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        this.newMessage('Registro exitoso');
        this.getAllAnimals();
        this.animalForm.reset({ nombre: '', edad: 0, tipo: '' });
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.toastr.error('No se pudo agregar el animal', 'Error');
      },
    });
  }

  // Alternar modo edición y cargar datos del animal
  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log('✏️ Editando animal con id:', this.idAnimal);

    this.animalService.getOneAnimal(id).subscribe({
      next: (data) => {
        this.animalForm.setValue({
          nombre: data.nombre || '',
          edad: data.edad || 0,
          tipo: data.tipo || '',
        });
        this.editableAnimal = true;
      },
      error: (err) => {
        console.error('❌ Error al obtener animal:', err);
        this.toastr.error('No se pudo cargar la información del animal', 'Error');
      },
    });
  }

  // Actualizar animal
  updateAnimalEntry() {
    if (!this.idAnimal) return;

    const updatedData: any = {};
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] !== '') {
        updatedData[key] = this.animalForm.value[key];
      }
    }

    this.animalService.updateAnimal(this.idAnimal, updatedData).subscribe({
      next: () => {
        this.newMessage('Animal editado');
        this.getAllAnimals();
        this.animalForm.reset({ nombre: '', edad: 0, tipo: '' });
        this.editableAnimal = false;
        this.idAnimal = null;
      },
      error: (err) => {
        console.error('❌ Error al actualizar animal:', err);
        this.toastr.error('No se pudo editar el animal', 'Error');
      },
    });
  }

  // 🗑️ Eliminar animal
  deleteAnimal(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este animal?')) return;

    this.animalService.deleteAnimal(id).subscribe({
      next: () => {
        this.toastr.info('Animal eliminado correctamente', 'Eliminado');
        this.getAllAnimals();
      },
      error: (err) => {
        console.error('❌ Error al eliminar animal:', err);
        this.toastr.error('No se pudo eliminar el animal', 'Error');
      }
    });
  }
}
