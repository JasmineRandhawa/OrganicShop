import { AppUser } from "./app-user";
import { OrderCart } from "./order-cart";

/*---Data Model for Order---*/
export class Order
{
    constructor(public cart : OrderCart = new OrderCart() ,
                public orderUId : string = "" ,
                public name : string = "" , 
                public address : string = "" ,
                public user : AppUser = new AppUser() ,
                public orderDate : string = "") {

    }
}