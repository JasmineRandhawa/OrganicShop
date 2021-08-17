import { Category } from 'src/app/models/category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from './api-service-urls';

@Injectable()

/*---Category Service to get category data to and from database---*/
export class CategoryService {

  headerOptions : object = {observe : 'response'};

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active categories---*/
  getAllActive = () => this.http.get(API.GET_ALL_ACTIVE_CATEGORIES_URL,this.headerOptions);

   /*---get all categories---*/
  getAll= () => this.http.get(API.GET_ALL_CATEGORIES_URL,this.headerOptions);

  /*---get category by id---*/
  getById = (categoryId:number) => this.http.get(API.GET_CATEGORY_BY_ID_URL + categoryId , 
                                                this.headerOptions) ;

  /*---add a new category--*/
   add = (category:Category) => this.http.post(API.ADD_CATEGORY_URL,category,this.headerOptions);

  /*---update category details---*/
  update = (category:Category) => this.http.patch(API.UPDATE_CATEGORY_URL,category,this.headerOptions);

  /*---activate a category--*/
  activate = (categoryId:number) => this.http.patch(API.ACTIVATE_CATEGORY_URL+categoryId ,{},this.headerOptions)
                                            .toPromise()
                                            .then((response:any)=> response.status == 200)
                                            .catch(() => false);

   /*---deactivate a category--*/
   deactivate = (categoryId:number) => this.http.patch(API.DEACTIVATE_CATEGORY_URL + categoryId ,{},this.headerOptions)
                                                .toPromise()
                                                .then((response:any)=> response.status == 200)
                                                .catch(() => false);
}
