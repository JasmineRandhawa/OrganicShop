import { Component, OnDestroy } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoryDto } from 'src/app/models/data-transfer-objects/ApiResponses/category-dto';
import { Category } from 'src/app/models/domain/category';

import { CategoryService } from 'src/app/services/category.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

@Component({
  selector: 'admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})

/*----Categories table Component----*/
export class AdminCategoriesComponent  implements OnDestroy{

  /*---class property declarations---*/ 
  categories : CategoryDto[] = [] ;
  categoryParam : string = "" ;
  filteredCategories : CategoryDto[] = [] ;
  categoriesSubscription : Subscription | undefined ;
  paramsSubscription : Subscription | undefined ;

  /*----Initialize data from API response----*/ 
  constructor(private categoryService : CategoryService, private router : Router, 
              private route : ActivatedRoute) {

    // get list of categories from API to populate the table
    this.categoriesSubscription = this.categoryService
                                      .getAll()
                                      .subscribe((response : any) =>  {
                                        if(response.status == 200)
                                        {
                                          let categoriesResponse = response.body as CategoryDto[];
                                          if(categoriesResponse && categoriesResponse.length > 0)
                                          {
                                            categoriesResponse.map((categoryDto : CategoryDto) =>
                                            {
                                              this.categories?.push(categoryDto);
                                              this.filteredCategories?.push(categoryDto);
                                            });

                                            this.paramsSubscription = this.route
                                                                          .paramMap
                                                                          .subscribe(params => {
                                                                            this.categoryParam = params.get('category') || "";
                                                                            if(this.categoryParam != "")
                                                                                this.filterCategories(this.categoryParam);
                                                                            
                                                                          });  
                                          }
                                        }
                                      });
  }

  /*---Check if any categories are available---*/
  get isAnyCategories() : boolean
  {
    return this.categories.length > 0
  }

  /*---Check if any categories match filter criteria---*/
  get isAnyFilteredCategories() : boolean
  {
    return this.filteredCategories.length > 0
  }

  /*----Filter Categories table on Search----*/ 
  filterCategories(categoryFilter : string) : void {
    
    if(this.categories.length > 0)
    {
      this.filteredCategories = this.categories;
      if(!isEmpty(categoryFilter))
        this.filteredCategories = this.categories
                                    .filter((category) => compare(category.name , categoryFilter));
    }
  }

  /*---update existing category---*/ 
  async OnUpdate(categoryDto : CategoryDto) : Promise<void> {
    let category : Category = new Category(categoryDto);
    let isUpdated = await this.categoryService.update(category);
    if (isUpdated) 
      categoryDto.isEdit=false;
    else
        showAlertOnAction("Category" , false, "update" , this.router , "/admin/categories")
  }

  /*---Activate Category---*/ 
  async onActivate(categoryDto : CategoryDto) : Promise<void> {
    let isActivated = await this.categoryService.activate(categoryDto.id);
    if (isActivated) 
      categoryDto.isActive = true;
    else
        showAlertOnAction("Category" , false , "activate" ,this.router ,"/admin/categories")
  }

  /*---Deactivate Category---*/ 
  async onDeactivate(categoryDto : CategoryDto) : Promise<void> {
    let isDeactivated = await this.categoryService.deactivate(categoryDto.id);
    if (isDeactivated) 
      categoryDto.isActive = false;
    else
        showAlertOnAction("Category" , false , "deactivate" , this.router , "/admin/categories")
  }

  /*---Unsubscribe from category service once the component is destroyed---*/ 
  ngOnDestroy() : void {
    this.paramsSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
