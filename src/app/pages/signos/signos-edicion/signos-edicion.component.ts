import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteDialogoComponent } from './../paciente-dialogo/paciente-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { Signos } from './../../../_model/signos';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Paciente } from './../../../_model/paciente';
import { SignosService } from './../../../_service/signos.service';
import { PacienteService } from './../../../_service/paciente.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  maxFecha: Date = new Date();
  form: FormGroup;
  pacientes: Paciente[];
  pacientesFiltrados$: Observable<Paciente[]>;
  edicion: boolean;
  id: number;

  constructor(
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.edicion = false;
    this.form = new FormGroup({
      'paciente': new FormControl(null),
      'fecha': new FormControl(''),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });
    this.loadData();
    this.signosService.getPacienteCreado().subscribe((data: any) => {
      console.log(data);
      this.pacientes.push(data);
      this.form.controls.paciente.setValue(data);
    });
    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });
  }

  loadData() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
    this.pacientesFiltrados$ = this.form.controls.paciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    if (this.edicion) {
      this.signosService.listarPorId(this.id).subscribe((data: any) => {
        this.form.controls.paciente.setValue(data.paciente);
        this.form.controls.fecha.setValue(data.fecha);
        this.form.controls.temperatura.setValue(data.temperatura);
        this.form.controls.pulso.setValue(data.pulso);
        this.form.controls.ritmoRespiratorio.setValue(data.ritmoRespiratorio);
      });
    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  submit() {
    if (this.form.invalid) { return; }
    if (this.edicion) {
      let signos: Signos = this.form.getRawValue();
      signos.signosId = this.id;
      this.signosService.modificar(signos).pipe(switchMap(() => {
        return this.signosService.listarPageable(0, 10);
      }))
        .subscribe(data => {
          this.signosService.setSignosCambio(data.content);
          this.signosService.setMensajeCambio('SE MODIFICO');
        });

    } else {
      this.signosService.registrar(this.form.getRawValue()).subscribe(() => {
        this.signosService.listarPageable(0, 10).subscribe(data => {
          this.signosService.setSignosCambio(data.content);
          this.signosService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['signos']);
  }


  abrirDialogo() {
    this.dialog.open(PacienteDialogoComponent, {
      width: '500px',
      data: null
    });
  }

}
