import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

import { Subscription, of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ShoppingCartResponseDto } from './models/data-transfer-objects/ApiResponses/shopping-cart-dto';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/*---Main Parent component of application---*/
export class AppComponent implements  OnDestroy {

  /*---class property declarations---*/
  title = 'organic-shop';
  userId : string = "";
  cartSubscription : Subscription | undefined;
  userSubscriotion : Subscription | undefined;

  /*---Inject services to get user and cart data---*/
  constructor(private userService : UserService , private authService : AuthService,
              private router : Router, private cartService : ShoppingCartService) {

     /*---Navigating user to return url if user is logged in---*/
     this.userSubscriotion =  this.authService.user$
                              .subscribe((user : firebase.User |null | undefined) =>
                              {
                                if(user && user.uid)
                                {
                                  this.userService.save(user);
                                  this.userId = user.uid;
                                  this.navigateToReturnURL();
                                }
                              });
  }

  /*---subscrivbe to cart service to get shopping-cart data for logged in user if any---*/
  get cartItemsCount$() : Observable<number>
  {
    return this.authService.user$.pipe(map((user:firebase.User |null | undefined) =>
                                      this.cartService.getCartByUser(user ? user.uid || "" : "")
                                  )).pipe(switchMap((response : any)=> {
                                      if(response && response.status==200)
                                      {
                                        let cart= response.body as ShoppingCartResponseDto;
                                        return of(cart.totalItemsCount);
                                      }
                                      return of(0);
                                    }));
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
