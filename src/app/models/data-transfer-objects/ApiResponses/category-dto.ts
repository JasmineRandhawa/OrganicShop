/*---DTO for Category---*/
export class CategoryDto
{
  constructor(public id : number = 0 ,
              public name : string = "",
              public isActive:boolean = false , 
              public isEdit :boolean = false) {

  }
}