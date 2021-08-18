import { Product } from 'src/app/models/product';
import { API } from './api-service-urls';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()

/*---Product Service to get/save/update/delete product data to and from web api database---*/
export class ProductService {

 headerOptions : object = {observe : 'response'};
 advancedODataQueryFilter="?$expand=Category";

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active products---*/
  getAllActive = () => this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter +
                                        " & $filter=Category/IsActive and IsActive eq true"
                                    ,this.headerOptions);

   /*---get all products---*/
  getAll= () => this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter ,
                              this.headerOptions);

  /*---get product by id---*/
  getById = (productId:number) => this.http.get(API.GET_ALL_PRODUCTS_URL + this.advancedODataQueryFilter +
                                                   " & $filter = Id eq " + productId,
                                                this.headerOptions);

  /*---add a new product---*/
   add = (product:any) => this.http.post(API.ADD_PRODUCT_URL,product,this.headerOptions)
                                    .toPromise()
                                    .then((response:any)=> response.status == 201)
                                    .catch(() => false);

  /*---update product details---*/
  update = (product:any) => this.http.patch(API.UPDATE_PRODUCT_URL,product,this.headerOptions)
                                .toPromise()
                                .then((response:any)=> response.status == 200)
                                .catch(() => false);

  /*---activate a product---*/
  activate = (productId:number) => this.http.patch(API.ACTIVATE_PRODUCT_URL+productId ,{},this.headerOptions)
                                            .toPromise()
                                            .then((response:any)=> response.status == 200)
                                            .catch(() => false);

   /*---deactivate a product---*/
   deactivate = (productId:number) => this.http.patch(API.DEACTIVATE_PRODUCT_URL + productId ,{},this.headerOptions)
                                                .toPromise()
                                                .then((response:any)=> response.status == 200)
                                                .catch(() => false);
}

