import { Component, Input} from '@angular/core';
import { Observable, of } from 'rxjs';

import { AppUser } from '../models/domain/app-user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/*---Navigation Bar Component---*/
export class NavbarComponent {

  /*----class property declarations----*/ 
  appUser : AppUser | undefined;
  cartItemsCount : number = 0;
  @Input('cart-items-count') cartItemsCount$ : Observable<number> = of(0);

  /*----Inject auth service----*/ 
  constructor(private auth : AuthService) {

    //get logged in user from auth service
    this.auth.appUser$.subscribe((appUser:AppUser|null) => 
                      {
                        if(appUser)
                        {
                          Object.assign(this.appUser , appUser);
                        }
                      });

    this.cartItemsCount$.subscribe(cartCount => this.cartItemsCount =  cartCount)
  }

  /*----logout from application----*/ 
  logout() : void
  {
    this.appUser = undefined;
    this.auth.logout();
  }
}
