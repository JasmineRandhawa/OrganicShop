import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API } from 'src/app/services/api-service-urls';

@Injectable()

/*---Product Service to get/save/update/delete product data to and from API---*/
export class ProductService {

  headerOptions : object = {observe : 'response'};
  advancedODataQueryFilter="?$expand=Category";

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active products---*/
  getAllActive = () : Observable<any> => 
      this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter +
                  " & $filter = Category/IsActive and IsActive eq true" , this.headerOptions)
                .pipe(
                    catchError((error) => this.handleError(error))
                );

  /*---get all products---*/
  getAll= () : Observable<any> => 
      this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter , this.headerOptions)
              .pipe(
                catchError((error) => this.handleError(error))
              );

  /*---get product by id---*/
  getById = (productId : number) : Observable<any>  => 
      this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter +
                    " & $filter = Id eq " + productId , this.headerOptions)
                .pipe(
                    catchError((error) => this.handleError(error))
                );

  /*---add a new product---*/
  add = (product : any) : Promise<Boolean> => 
      this.http.post(API.ADD_PRODUCT_URL , product , this.headerOptions)
                .toPromise()
                .then((response:any) => response.status == 201)
                .catch(() => false);

  /*---update product details---*/
  update = (product : any) : Promise<Boolean> => 
      this.http.put(API.UPDATE_PRODUCT_URL , product , this.headerOptions)
                .toPromise()
                .then((response:any) => response.status == 200)
                .catch(() => false);

  /*---activate a product---*/
  activate = (productId : number) : Promise<Boolean> => 
      this.http.patch(API.ACTIVATE_PRODUCT_URL + productId , {} , this.headerOptions)
                .toPromise()
                .then((response:any) => response.status == 200)
                .catch(() => false);

    /*---deactivate a product---*/
  deactivate = (productId : number) : Promise<Boolean> => 
      this.http.patch(API.DEACTIVATE_PRODUCT_URL + productId , {} , this.headerOptions)
                .toPromise()
                .then((response:any) => response.status == 200)
                .catch(() => false);
  
  handleError(error: any): any {
      console.log("An unexpected error occured! from api service. " , error);
      return of(null);
  }
}

