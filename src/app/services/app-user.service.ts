import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { API } from './api-service-urls';
import { AppUser } from '../models/domain/app-user';

@Injectable({
  providedIn: 'root'
})
/*---AppUser Service to get/add/update/delete user data to and from API---*/
export class AppUserService {

  headerOptions : object = {observe : 'response'};

  /*---Inject http web api client---*/
  constructor(private http:HttpClient) {  
  }

  /*---get all active categories---*/
  getUserById = (appUserId : string) : Observable<any> => 
      this.http.get(API.GET_USER_BY_ID_URL + "?$filter = AppUserId eq " + appUserId , this.headerOptions) 
               .pipe(
                  catchError((error) => this.handleError(error))
               );
  /*---add a new category--*/
  add = (appUser : AppUser) => 
      this.http.post(API.ADD_USER_URL,appUser , this.headerOptions)
               .toPromise()
               .then((response : any) => response.status == 201)
               .catch(() => false);

  /*---update category details---*/
  update = (appUser : any) =>    
      this.http.patch(API.UPDATE_USER_URL,appUser , this.headerOptions)
               .toPromise()
               .then((response : any) => response.status == 200)
               .catch(() => false);

  /*---activate a category--*/
  activate = (userId : number) => 
      this.http.patch(API.ACTIVATE_USER_URL + userId , {} , this.headerOptions)
               .toPromise()
               .then((response : any)=> response.status == 200)
               .catch(() => false);

   /*---deactivate a category--*/
   deactivate = (userId : number) => 
      this.http.patch(API.DEACTIVATE_USER_URL + userId , {} , this.headerOptions)
               .toPromise()
               .then((response : any) => response.status == 200)
               .catch(() => false);
               
    handleError(error: any): any {
      console.log("An unexpected error occured! from api service. " , error);
      return of(null);
  }  
}
          