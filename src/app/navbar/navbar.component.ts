import { Component, Input} from '@angular/core';
import { Observable, of } from 'rxjs';

import { AppUser } from '../models/domain/app-user';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartResponseDto } from '../models/data-transfer-objects/ApiResponses/shopping-cart-dto';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/*---Navigation Bar Component---*/
export class NavbarComponent {

  /*----class property declarations----*/ 
  appUser : AppUser | null = new AppUser();
  c:number=0
  @Input('cart-items-count') cartItemsCount : Observable<number|undefined> | undefined ;
  

  /*----Inject auth service----*/ 
  constructor(private auth : AuthService,private cartService: ShoppingCartService) {

    //get logged in user from auth service
    this.auth.appUser$.subscribe((appUser:AppUser|null) => 
                      {
                          Object.assign(this.appUser , appUser);
                      });
                      this.getCartCount();
  }

  getCartCount()
  {
    let cartId = localStorage.getItem('cartId');
    if (cartId && cartId!="") 
    {
      this.cartService.getCartById(+cartId).subscribe((response : any)=> {
      if(response && response.status==200)
      {
        let cart = response.body as ShoppingCartResponseDto;
        let cartObj = new ShoppingCartResponseDto(cart.id, cart.appUserId, cart.appUserName,
                        cart.items);
        this.c = cartObj.totalItemsCount;
        return cartObj.totalItemsCount
      }
      return undefined;
    });
    }
    return undefined;
  }

  /*----logout from application----*/ 
  logout() : void
  {
    this.appUser = null;
    this.auth.logout();
  }
}
