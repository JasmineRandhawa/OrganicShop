import { ProductDto } from '../data-transfer-objects/ApiResponses/product-dto';
import { Category } from './category';

/*---Data Model for Product---*/
export class Product
{
    public Id : number = 0 ; 
    public Title : string = "" ;
    public Price : number = 0 ;
    public CategoryName : string = "" ;
    public Category : Category = {Id : 0, Name : "", IsActive : false } ;
    public ImageURL : string = "" ;
    public IsActive : boolean = false ;
    
    constructor(productDto? : ProductDto) {
        if(productDto)
        {
            this.Id = productDto.id;
            this.Title = productDto.title;
            this.Price = productDto.price;
            this.CategoryName = productDto.category;
            this.ImageURL = productDto.imageURL;
            this.IsActive = productDto.isActive;
        }
    }
}