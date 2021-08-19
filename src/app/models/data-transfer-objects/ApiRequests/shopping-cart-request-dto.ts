import { ShoppingCartItemRequestDto } from '../ApiRequests/shopping-cart-item-request-dto';

/*---DTO for Shopping Cart API Request---*/

export class ShoppingCartRequestDto
{
    constructor(public AppUserId : string  = "" , 
                public Items : ShoppingCartItemRequestDto[] = []) {
    }
}