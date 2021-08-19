import { Component, Input} from '@angular/core';
import { ShoppingCartItemDto } from '../../../models/data-transfer-objects/ApiResponses/shopping-cart-item-dto';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
/*---Product card component for rendering single product---*/
export class ProductCardComponent{

  /*---class property declarations---*/
  @Input('cart-item') cartItem : ShoppingCartItemDto | undefined;
  @Input('app-user-id') appUserId : string |undefined
 
}
