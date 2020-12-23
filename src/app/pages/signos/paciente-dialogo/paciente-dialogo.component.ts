import { SignosService } from './../../../_service/signos.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-dialogo',
  templateUrl: './paciente-dialogo.component.html',
  styleUrls: ['./paciente-dialogo.component.css']
})
export class PacienteDialogoComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PacienteDialogoComponent>,
    private pacienteService: PacienteService,
    private signosService: SignosService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'nombres': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),
    });

  }


  get f() {
    return this.form.controls;
  }

  operar() {
    if (this.form.invalid) { return; }

    let paciente = new Paciente();
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    //REGISTRAR
    this.pacienteService.registrar(paciente).subscribe((data: any) => {
      this.pacienteService.listarPorLocation(data.headers.get('Location')).subscribe((response: any) => {
        console.log(response);
        this.signosService.setPacienteCreado(response);
      });
      this.signosService.setMensajeCambio('Se ha creado el paciente.');

    },
      (error) => {
        console.log(error);
        this.signosService.setMensajeCambio(error.mensaje);
      });
    this.cerrar();

  }


  cerrar() {
    this.dialogRef.close();
  }
}
