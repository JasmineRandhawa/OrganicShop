import { ShoppingCartItemDto } from "./shopping-cart-item-dto";

/*---DTO for Shopping Cart---*/
export class ShoppingCartResponseDto
{
    constructor(public id : number = 0 , 
                public appUserId : string = "" ,
                public appUserName : string = "" ,
                public items : ShoppingCartItemDto[] = []) {           
    }

    //compute items count
    get totalItemsCount() : number {
        let count = 0;
        for (let item of this.items) {
            count += item.quantity;
        }
        return count;
    }

    //compute total price
    get totalPrice() : number {
        let totalPrice = 0;
        for (let item in this.items) {
            totalPrice += (this.items[item]).product.price * (this.items[item]).quantity;
        }
        return totalPrice;
    }

     //is any items in the cart
     get isAnyItems() : boolean {
        return this.totalItemsCount > 0
    }
}