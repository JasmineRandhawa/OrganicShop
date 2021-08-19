import { CategoryDto } from "../data-transfer-objects/ApiResponses/category-dto";

/*---Data Model for Category---*/
export class Category
{
  public Id : number = 0 ;
  public Name : string = "" ;
  public IsActive : boolean = false ;
  
  constructor( categoryDto? : CategoryDto) {
    if(categoryDto)
    {
      this.Id =  categoryDto.id; 
      this.Name  =  categoryDto.name;
      this.IsActive = categoryDto.isActive ;
    }
  }
}