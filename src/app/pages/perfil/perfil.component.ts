import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nombre: string;
  roles: string[];

  constructor() { }

  ngOnInit(): void {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const helper = new JwtHelperService();
    if (!helper.isTokenExpired(token)) {
      const decodedToken = helper.decodeToken(token);
      console.log(decodedToken);
      this.nombre = decodedToken.user_name;
      this.roles = decodedToken.authorities;
    }
  }

}
