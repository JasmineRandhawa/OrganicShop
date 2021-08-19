import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API } from 'src/app/services/api-service-urls';
import { Category } from '../models/domain/category';

@Injectable()

/*---Category Service to get/add/update/delete category data to and from API---*/
export class CategoryService {

  headerOptions : object = {observe : 'response'};

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active categories---*/
  getAllActive = () : Observable<any> => 
      this.http.get(API.GET_ALL_ACTIVE_CATEGORIES_URL , this.headerOptions)
                .pipe(
                  catchError((error) => this.handleError(error))
                );

  /*---get all categories---*/
  getAll = () : Observable<any> => 
      this.http.get(API.GET_ALL_CATEGORIES_URL , this.headerOptions)
                .pipe(
                  catchError((error) => this.handleError(error))
                );

  /*---get category by id---*/
  getById = (categoryId : number) : Observable<any> => 
      this.http.get(API.GET_CATEGORY_BY_ID_URL + categoryId , this.headerOptions)
                .pipe(
                  catchError((error) => this.handleError(error))
                );

  /*---add a new category--*/
  add = (category : Category) : Promise<Boolean> => 
    this.http.post(API.ADD_CATEGORY_URL , category , this.headerOptions)
              .toPromise()
              .then((response : any) => response.status == 201)
              .catch(() => false);

  /*---update category details---*/
  update = (category : Category) : Promise<Boolean> =>  
      this.http.patch(API.UPDATE_CATEGORY_URL , category , this.headerOptions)
                .toPromise()
                .then((response : any) => response.status == 200)
                .catch(() => false);

  /*---activate a category--*/
  activate = (categoryId : number) : Promise<Boolean> => 
      this.http.patch(API.ACTIVATE_CATEGORY_URL + categoryId , {} , this.headerOptions)
                .toPromise()
                .then((response : any)=> response.status == 200)
                .catch(() => false);

  /*---deactivate a category--*/
  deactivate = (categoryId:number) : Promise<Boolean> => 
      this.http.patch(API.DEACTIVATE_CATEGORY_URL + categoryId , {} , this.headerOptions)
                .toPromise()
                .then((response : any) => response.status == 200)
                .catch(() => false);

  handleError(error: any): any {
      console.log("An unexpected error occured! from api service. " , error);
      return of(null);
  }  
}
