import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignosService } from './../../_service/signos.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Signos } from 'src/app/_model/signos';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {
  displayedColumns = ['idPaciente', 'nombres', 'apellidos', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio', 'acciones'];
  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signosService: SignosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.signosService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Signos, filter: string) => {
        let valor = data.paciente.nombres+data.paciente.apellidos;
        return  valor.toLowerCase().includes(filter);
      };
     
    })
    this.signosService.getSignosCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idPaciente: number) {
    this.signosService.eliminar(idPaciente).pipe(switchMap(() => {
      return this.signosService.listarPageable(0,10);
    }))
      .subscribe(data => {
        this.signosService.setSignosCambio(data.content);
        this.signosService.setMensajeCambio('SE ELIMINO');
      });

  }

  crearTabla(data: Signos[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Signos, filter: string) => {
      let valor = data.paciente.nombres+data.paciente.apellidos;
      return  valor.toLowerCase().includes(filter);
    };
  }

  mostrarMas(e: any) {
    this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Signos, filter: string) => {
        let valor = data.paciente.nombres+data.paciente.apellidos;
        return  valor.toLowerCase().includes(filter);
      };
    });
  }

}
