import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShoppingCartResponseDto } from 'src/app/models/data-transfer-objects/ApiResponses/shopping-cart-dto';
import { AppUser } from 'src/app/models/domain/app-user';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
/*---Component to Display all shopping cart items---*/
export class ShoppingCartComponent implements OnInit,OnDestroy {

  /*---class feilds declarations---*/
  cartSubscription: Subscription | undefined;
  cart:ShoppingCartResponseDto = new ShoppingCartResponseDto();
  userSubscription: Subscription | undefined;
  appUser: AppUser = new AppUser();

  /*---Get all items in the shopping cart and computer total price and items count ---*/
  ngOnInit(): void {

  }

  /*---Inject shopping cart service---*/
  constructor(private cartService: ShoppingCartService, private router: Router,private authService:AuthService) {
    this.userSubscription = this.authService.appUser$
                                            .subscribe((appUser :AppUser | null) => {
                                              if(appUser) {
                                              this.appUser = appUser;
                                              if(this.appUser.AppUserId)
                                              this.cartSubscription = this.cartService
                                                                          .getCartByUser(this.appUser.AppUserId)
                                                                          .subscribe((response:any)=> {
                                                                              this.populateCart(response);
                                                                            });
                                              }
                                      });

  }

  populateCart(response: any) {
    if(response && response.status==200)
    {
      let cartDto = response.body as ShoppingCartResponseDto;
      if(cartDto) {
        this.cart =  cartDto;
      }
    }
  }

  get isAnyItems()
  {
    return this.cart.items.length > 0
  }

  /*---remove all Items from the shopping cart---*/
  async clearCart()
  {
    let isDeleted = await this.cartService.removeAllFromCart(this.cart.id);
    showAlertOnAction("Cart Items" , isDeleted , "cleare", this.router,"/products")
  }

  checkOut()
  {
    this.router.navigate(['/check-out/'+this.cart.id]);
  }
  
  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
