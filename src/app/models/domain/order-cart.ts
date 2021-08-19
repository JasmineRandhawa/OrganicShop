import { ShoppingCartItemDto } from "../data-transfer-objects/ApiResponses/shopping-cart-item-dto";

/*---Data Model for Order Cart---*/
export class OrderCart
{
    constructor(public items: { [productId : string] : ShoppingCartItemDto } = {} , 
                public cartUId : string = "" ) {
    }
}