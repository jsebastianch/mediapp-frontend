import { Paciente } from 'src/app/_model/paciente';
import { Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { Signos } from '../_model/signos';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos> {

  private signosCambio = new Subject<Signos[]>();
  private mensajeCambio = new Subject<string>();
  private pacienteCreado = new Subject<Paciente>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`
    );
  }  

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  getSignosCambio(){
    return this.signosCambio.asObservable();
  }

  setSignosCambio(pacientes : Signos[]){
    this.signosCambio.next(pacientes);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }

  getPacienteCreado(){
    return this.pacienteCreado.asObservable();
  }

  setPacienteCreado(paciente: Paciente){
    this.pacienteCreado.next(paciente);
  }

}
