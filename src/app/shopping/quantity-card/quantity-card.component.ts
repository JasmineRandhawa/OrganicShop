import { Component, Input } from '@angular/core';

import { ShoppingCartItemDto } from '../../models/data-transfer-objects/ApiResponses/shopping-cart-item-dto';
import { ShoppingCartRequestDto } from '../../models/data-transfer-objects/ApiRequests/shopping-cart-request-dto';
import { ShoppingCartItemRequestDto } from '../../models/data-transfer-objects/ApiRequests/shopping-cart-item-request-dto';

import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCartResponseDto } from 'src/app/models/data-transfer-objects/ApiResponses/shopping-cart-dto';

@Component({
  selector: 'quantity-card',
  templateUrl: './quantity-card.component.html',
  styleUrls: ['./quantity-card.component.css']
})
export class QuantityCardComponent {

  /*---class property declarations---*/
  @Input('cart-item') cartItem : ShoppingCartItemDto | undefined
  @Input('app-user-id') appUserId : string | undefined

  /*---Inject shopping cart service---*/
   constructor(private cartService : ShoppingCartService){

   }
 
  addToCart(cartItem : ShoppingCartItemDto | undefined , appUserId : string | undefined) {
    if(cartItem)
    {
      let cartId = localStorage.getItem('cartId');
      if (cartId && cartId!="") 
      {
        if(this.cartItem)
          this.cartItem.shoppingCartId = +cartId;
        this.addCartItemToExistingCart(cartItem);
      }
      else
        this.createNewCartWithCartItem(cartItem , appUserId);
    }
  }

  async addCartItemToExistingCart(cartItem : ShoppingCartItemDto) : Promise<void> {
      cartItem.quantity = 1;
      if(this.cartItem)
        this.cartItem.quantity = 1;

      let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id , cartItem.product.id ,
                                                       cartItem.quantity , cartItem.shoppingCartId)
      console.log("Added cart Item to existing Cart" ,  cartItemReq);
      let newItemId = await this.cartService.addCartItem(cartItemReq);
      if(newItemId && newItemId > 0 && this.cartItem) 
        this.cartItem.id =  newItemId;          
  }

  async createNewCartWithCartItem(cartItem : ShoppingCartItemDto , 
                                  appUserId : string | undefined) : Promise<void> {
      console.log(this.cartItem)
      cartItem.quantity = 1;
      if(this.cartItem)
      this.cartItem.quantity = 1;
      if(appUserId != "")
      {
        let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id , cartItem.product.id ,
                                                         cartItem.quantity , cartItem.shoppingCartId)
        let cart = new ShoppingCartRequestDto(appUserId, [cartItemReq])
        console.log("Created New Cart", cartItemReq);
        let newCart  = await this.cartService.addNewCart(cart);
        if(newCart) 
        {
          if(newCart.items)
          {
            //console.log(newCart.items);
            let cartItem = newCart.items.filter(item =>item.product.id == cartItemReq.ProductId)[0];
            //console.log(cartItem);
            if(cartItem && this.cartItem)
              this.cartItem.id = cartItem.id;
          }
          if(this.cartItem) 
          {
            let cartId = localStorage.getItem('cartId');
            if(!cartId || cartId =="")
            {
              this.cartItem.shoppingCartId = newCart.id; 
              localStorage.setItem('cartId', newCart.id+"");
            }
              
          }
          console.log(this.cartItem)
        }
       
      }   
  }

  incrementCartItemQuantity(cartItem : ShoppingCartItemDto | undefined) : void {
    if(cartItem)
    {
      if(this.cartItem)
        this.cartItem.quantity = cartItem.quantity + 1;

      let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id , cartItem.product.id ,
                                                       cartItem.quantity , cartItem.shoppingCartId)
     // console.log("Incremented quantity of existing cart Item", cartItemReq);
      this.cartService.updateCartItem( cartItemReq);
    }
  }

  async decrementCartItemQuantity(cartItem : ShoppingCartItemDto | undefined) : Promise<void> {
    if(cartItem)
    {
      let quantity = cartItem.quantity - 1;

      //if updated quantity is greater than 0 , update quantity of product in cart   
      if ((quantity || 0) > 0)
      {
        if(this.cartItem)
         this.cartItem.quantity = quantity;

        let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id , cartItem.product.id,
                                                         cartItem.quantity , cartItem.shoppingCartId)
        //console.log("Decremented quantity of existing cart Item", cartItemReq);
        this.cartService.updateCartItem( cartItemReq);
      }
      //else remove item from cart  
      else {
        cartItem.quantity = 0;
        if(this.cartItem)
          this.cartItem.quantity = 0;
        console.log("Removed existing cart Item from cart", cartItem);
        let isRemoved = await this.cartService.removeItemFromCart(cartItem.id);
        if(isRemoved && this.cartItem)
           this.cartItem.id = 0;
    }
   }
  }
}
