import { CategoryDto } from './category-dto';
import { Category } from 'src/app/models/category';

/*---Data Model for Product---*/
export class Product
{
    constructor(public Id : number = 0 , public Title : string = "", 
                public Price : number = 0,
                public Category : Category = { Id : 0, Name : "", IsActive : false },
                public ImageURL : string = "" , public IsActive : boolean = false) {

    }
}