/*---Data Model for App User---*/
export class AppUser
{
    constructor( public AppUserId : string = "" , 
                 public Name : string = "" , 
                 public Email : string = "" , 
                 public IsAdmin : boolean = false ,
                 public IsActive : boolean = true) {
    }
}