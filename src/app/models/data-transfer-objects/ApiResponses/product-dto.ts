/*---DTO for Product---*/
export class ProductDto
{
    constructor(public id : number = 0 , 
                public title : string = "" , 
                public price : number = 0 ,
                public category :string = "" ,
                public imageURL : string = "" ,
                public isActive : boolean = false ) {

    }
}