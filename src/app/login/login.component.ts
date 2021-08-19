import { Component} from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/*---Login Component---*/
export class LoginComponent {

  /*---Inject auth service and router---*/
  constructor(private authService : AuthService , private router : Router) {
   }

  /*---Login with Google account---*/
  login() :void {

    this.authService.login();

    //once user is logged in , redirect to home page
    if(this.authService.isAuthenticated)
      this.router.navigate(['/']);

  }
}
