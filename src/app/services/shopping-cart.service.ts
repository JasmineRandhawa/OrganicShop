import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ShoppingCartItemRequestDto } from '../models/data-transfer-objects/ApiRequests/shopping-cart-item-request-dto';
import { API } from './api-service-urls';
import { ShoppingCartResponseDto } from '../models/data-transfer-objects/ApiResponses/shopping-cart-dto';

@Injectable()

/*---Shopping Cart Service to get/save/update/delete shopping-cart and shopping-cart-Items data from API---*/
export class ShoppingCartService {

  headerOptions : object = {observe : 'response'};

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active products---*/
  getCartByUser = (userId : string) : Observable<Object | null> => 
    this.http.get(API.GET_CART_BY_USER + userId , this.headerOptions)
              .pipe(
                  catchError((error) => this.handleError(error))
                );

   /*---get all products---*/
  getCartById= (cartId : number) : Observable<Object | null> => 
    this.http.get(API.GET_CART_BY_ID + cartId , this.headerOptions)
            .pipe(
              catchError((error) => this.handleError(error))
            );

  /*---add a new Cart---*/
  addNewCart = (cart : any) :  Promise<ShoppingCartResponseDto|undefined> => 
    this.http.post(API.ADD_CART_URL , cart , this.headerOptions)
             .toPromise()
             .then((response : any) => 
              {
                if(response.status == 201) 
                  return response.body as ShoppingCartResponseDto 
                else return undefined;
              })
              .catch(() => undefined);

  /*---add Cart item details in Cart---*/
  addCartItem = (cartItem : ShoppingCartItemRequestDto) : Promise<number|undefined> => 
    this.http.post(API.ADD_CART_ITEM_URL , cartItem , this.headerOptions)
              .toPromise()
              .then((response : any) => 
              {
                if(response.status == 201) 
                {
                  console.log(response.body);
                  return response.body as number 
                }
                else return undefined;
              })
              .catch(() => undefined);

  /*---add Cart item details in Cart---*/
  updateCartItem = (cartItem : ShoppingCartItemRequestDto) : Promise<Boolean> => 
    this.http.patch(API.UPDATE_CART_ITEM_URL , cartItem , this.headerOptions)
            .toPromise()
            .then((response : any) => response.status == 200)
            .catch(() => false);


  /*---delete an item from Cart---*/
  removeItemFromCart = (cartItemId : number) : Promise<Boolean> =>
    this.http.delete(API.DELETE_ITEM_FROM_CART_URL+ cartItemId , this.headerOptions)
            .toPromise()
            .then((response : any) => response.status == 204)
            .catch(() => false);
  
  /*---delete all items from Cart---*/
  removeAllFromCart = (cartId : number) : Promise<Boolean> => 
    this.http.delete(API.DELETE_ALL_FROM_CART_URL + cartId , this.headerOptions)
              .toPromise()
              .then((response : any) => response.status == 204)
              .catch(() => false);

  handleError(error: any) : Observable<null> {
    console.log("An unexpected error occured! from api service. " , error);
    return of(null);
  }
}
