import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal-service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Agregar Validators
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

  constructor(
    private animalService: AnimalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: ['', Validators.required], // Agregar validador
      edad: [0, Validators.required],    // Agregar validador
      tipo: ['', Validators.required]    // Agregar validador
    });
    this.getAllAnimals();
  }

  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: any) => {
      this.animalList = data;
    });
  }

  newMessage(messageText: string) {
    this.toastr.success('¡Clic aquí para actualizar la lista!', messageText);
  }

  newAnimalEntry() {
    if (!this.animalForm.valid) return;

    // AGREGAR LA FECHA automáticamente
    const animalData = {
      ...this.animalForm.value,
      fecha: new Date()  // ← ESTA LÍNEA ES CLAVE
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
}