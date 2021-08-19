import { Component, Input } from '@angular/core';
import { ShoppingCartItemDto } from '../../models/data-transfer-objects/ApiResponses/shopping-cart-item-dto';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCartRequestDto } from 'src/app/models/data-transfer-objects/ApiRequests/shopping-cart-request-dto';
import { ShoppingCartItemRequestDto } from 'src/app/models/data-transfer-objects/ApiRequests/shopping-cart-item-request-dto';

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
 
  addToCart(cartItem : ShoppingCartItemDto | undefined , appUserId : any) {
    if(cartItem)
    {
      if (cartItem.shoppingCartId > 0) 
        this.addCartItemToExistingCart(cartItem);
      else
        this.createNewCartWithCartItem(cartItem,appUserId);
    }
  }

  async addCartItemToExistingCart(cartItem : ShoppingCartItemDto) : Promise<void> {
      cartItem.quantity = 1;
      if(this.cartItem)
        this.cartItem.quantity = 1;
      console.log("Added cart Item to existing Cart" ,  cartItem);

      let newItemId = await this.cartService.addCartItem(cartItem);
      if(newItemId && newItemId!="" && this.cartItem) 
        this.cartItem.id = +newItemId;          
  }

  createNewCartWithCartItem(cartItem : ShoppingCartItemDto , 
                            appUserId : string|undefined) : void {
      cartItem.quantity = 1;
      if(this.cartItem)
      this.cartItem.quantity = 1;
      if(appUserId != "")
      {
        let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id,cartItem.product.id,
                          cartItem.quantity,cartItem.shoppingCartId)
        let cart = new ShoppingCartRequestDto(appUserId, [cartItemReq])
        console.log("Created New Cart", cart);
        this.cartService.addNewCart(cart);
      }   
  }

  incrementCartItemQuantity(cartItem : any) : void {
    if(cartItem)
    {
      if(this.cartItem)
        this.cartItem.quantity = cartItem.quantity + 1;
        cartItem.quantity = cartItem.quantity + 1;

      let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id,cartItem.product.id,
      cartItem.quantity,cartItem.shoppingCartId)
      console.log("Incremented quantity of existing cart Item", cartItemReq);
      this.cartService.updateCartItem( cartItemReq);
    }
  }

  decrementCartItemQuantity(cartItem : any) : void {
    if(cartItem)
    {
      let quantity = cartItem.Quantity - 1;

      //if updated quantity is greater than 0 , update quantity of product in cart   
      if ((quantity || 0) > 0)
      {
        if(this.cartItem)
         this.cartItem.quantity = quantity;
        cartItem.quantity = quantity;

        let cartItemReq = new ShoppingCartItemRequestDto(cartItem.id,cartItem.product.id,
        cartItem.quantity,cartItem.shoppingCartId)
        console.log("Decremented quantity of existing cart Item", cartItemReq);
        this.cartService.updateCartItem( cartItemReq);
      }
      //else remove item from cart  
      else {
        cartItem.quantity = 0;
        if(this.cartItem)
          this.cartItem.quantity = 0;
        console.log("Removed existing cart Item from cart", cartItem);
        this.cartService.removeItemFromCart(cartItem.shoppingCartId)
    }
   }
  }
}
