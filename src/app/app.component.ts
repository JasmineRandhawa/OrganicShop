import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { Subscription, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCartResponseDto } from './models/data-transfer-objects/ApiResponses/shopping-cart-dto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/*---Main Parent component of application---*/
export class AppComponent implements  OnInit,OnDestroy {

  /*---class property declarations---*/
  title = 'organic-shop';
  userId : string = "";
  cartItemsCount : number = 0;
  cart:ShoppingCartResponseDto|undefined;
  cartSubscription : Subscription | undefined;
  userSubscriotion : Subscription | undefined;

  /*---Inject services to get user and cart data---*/
  constructor(private userService : UserService , private authService : AuthService,
              private router : Router, private cartService : ShoppingCartService) {

     
  }

  get CartCount()
  {
    let cartId = localStorage.getItem('cartId');
    if (cartId && cartId!="") 
    {
      return this.cartService.getCartById(+cartId).pipe(map((response : any)=> {
        this.cartItemsCount = 0;
      if(response && response.status==200)
      {
        let cart = response.body as ShoppingCartResponseDto;
        this.cart = new ShoppingCartResponseDto(cart.id, cart.appUserId, cart.appUserName,
                        cart.items);
        
        this.cartItemsCount = this.cart.totalItemsCount;
        return this.cartItemsCount
      }
      return undefined;
    }));
    }
    return undefined;
  }

  ngOnInit(): void {
    /*---Navigating user to return url if user is logged in---*/
      let cartId = localStorage.getItem('cartId');
      if (cartId && cartId!="") 
      {
        this.cartService.getCartById(+cartId).subscribe((response : any)=> {
          this.cartItemsCount = 0;
        if(response && response.status==200)
        {
          let cart = response.body as ShoppingCartResponseDto;
          this.cart = new ShoppingCartResponseDto(cart.id, cart.appUserId, cart.appUserName,
                         cart.items);
          
          this.cartItemsCount = this.cart.totalItemsCount;
        }
      });
    }
      this.navigateToReturnURL();
    }
  
  
  /*---Navigate to return URl if any---*/
  private navigateToReturnURL() : void
  {
    /* extract return url from local storage*/
    let returnURL = localStorage.getItem('returnURL');

    //clear the return url after extration
    localStorage.removeItem('returnURL');

    //navigate user to return url
    if (returnURL && returnURL !== '/' && returnURL !== '/login')
      this.router.navigateByUrl(returnURL);
  }

  /*--Unsunscribe from the cart service on component destruction--*/
  ngOnDestroy() : void {
    this.cartSubscription?.unsubscribe();
    this.userSubscriotion?.unsubscribe();
  }

}
