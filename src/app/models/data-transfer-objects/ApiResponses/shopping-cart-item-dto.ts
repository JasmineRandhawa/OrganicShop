import { Product } from '../../domain/product';
import { ProductDto } from './product-dto';

/*---DTO for Shopping Cart Item---*/
export class ShoppingCartItemDto
{
    
    public product : ProductDto = new ProductDto();

    constructor(public id :number = 0 , 
                public quantity : number = 0 ,
                public productDto : Product = new Product() ,
                public shoppingCartId : number = 0) {

        this.product.id = productDto.Id;
        this.product.title = productDto.Title;
        this.product.imageURL = productDto.ImageURL;
        this.product.price = productDto.Price;
        this.product.category = productDto.Category.Name;    
    }

    // compute total price of a product
    get totalPricePerProduct() : number
    {
      return this.product.price * this.quantity;
    }
}