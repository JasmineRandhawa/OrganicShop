/*---DTO for Shopping Cart Item API Request---*/

export class ShoppingCartItemRequestDto
{
    constructor(public Id : number = 0 , 
                public ProductId : number  = 0 , 
                public Quantity : number = 0 , 
                public ShoppingCartId : number = 0) {
    }
}