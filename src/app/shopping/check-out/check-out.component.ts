import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ShoppingCartResponseDto } from '../../models/data-transfer-objects/ApiResponses/shopping-cart-dto';
import { AppUser } from 'src/app/models/domain/app-user';

import { AuthService } from 'src/app/services/auth.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
/* Check-out Component */
export class CheckOutComponent{

  /*----property declarations----*/
  cart : ShoppingCartResponseDto = new ShoppingCartResponseDto();
  cartSubscription : Subscription | undefined;
  cartIdSubscription : Subscription | undefined;
  userSubscription : Subscription | undefined;
  appUser : AppUser = new AppUser();

  /*----Subscribe to query params----*/
  constructor(private route : ActivatedRoute , private cartService : ShoppingCartService , 
              private authService : AuthService) { 
     //get the cart object from the query param
     this.cartIdSubscription =  this.route
                                    .paramMap
                                    .subscribe((cartParams : any) => {
                                      this.cart.id = cartParams.get('id');
                                      this.subscribeToCart();
                                    });
  }

  /*----subscribe to cart service to get cart Info----*/
  private subscribeToCart() : void {
    this.userSubscription = this.authService.appUser$
                                            .subscribe((appUser :AppUser | null) => {
                                              if(appUser) {
                                              this.appUser = appUser;
                                              this.cartSubscription = this.cartService
                                                                          .getCartByUser(this.appUser.AppUserId)
                                                                          .subscribe((response:any) => 
                                                                              this.populateCart(response)
                                                                            );
                                              }
                                            });

  }

  populateCart(response: any) {
    if(response.status=200)
    {
      let cartDto = response.body as ShoppingCartResponseDto;
      this.cart =  cartDto;
    }
  }

  onPlaceOrder(formValue:any)
  {
    //let shoppingCart = {items:this.cart.Items, Id : this.cart.Id}
    //let orderObj = new Order(shoppingCart, "", formValue.name, formValue.address,
                             //this.cart.user,getCurrentDate());
    //let newOrderUId = this.orderService.save(orderObj);
    //showAlertOnAction("Order", newOrderUId,"place",this.router,'/my-orders');
  }

  /*----unsubscribe from cart service on component destruction----*/
  ngOnDestroy() : void {
    this.userSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
    this.cartIdSubscription?.unsubscribe();
  }
}
