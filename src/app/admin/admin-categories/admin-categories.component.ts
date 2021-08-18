
import { Category } from 'src/app/models/category';
import { CategoryDto } from 'src/app/models/category-dto';
import { CategoryService } from 'src/app/services/category.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})

/*----Categories table Component----*/
export class AdminCategoriesComponent  implements OnDestroy{

  /*---class property declarations---*/ 
  isEditClicked = false;
  categories: Category[] = [];
  categoryParam : string = "";
  filteredCategories: Category[] = [];
  categoriesSubscription: Subscription | undefined;
  paramsSubscription: Subscription | undefined;

  /*----Initialize properties from firebase database----*/ 
  constructor(private categoryService: CategoryService, private router:Router, private route:ActivatedRoute) {

    // get list of products from firebase to populate the table
    this.categoriesSubscription = this.categoryService
                                      .getAll()
                                      .subscribe((response:any) =>  {
                                        if(response.status == 200)
                                        {
                                          let categories = response.body as CategoryDto[];
                                          if(categories && categories.length > 0)
                                          {
                                            categories.map((category)=>
                                            {
                                              let categoryObj: Category = { Id : category.id, 
                                                                            Name : category.name, 
                                                                            IsActive : category.isActive };
                                              this.categories?.push(categoryObj);
                                              this.filteredCategories?.push(categoryObj);
                                            });

                                                //whenever the url category filter param changes , filter the products
                                              this.categoriesSubscription = this.route.paramMap
                                                                                .subscribe(params => {
                                                                                  this.categoryParam = params.get('Name') || "";
                                                                                  if(this.categoryParam != "")
                                                                                      this.filterCategories(this.categoryParam);
                                                                                  
                                                                                });  
                                          }
                                        }
                                        else
                                        { 
                                          console.log(response.status , response.body)
                                          alert("An unexpected error from API : Response Code: "+ response.status);
                                        }
                                      });
  }

  /*---Check if any categories are available---*/
  get isAnyCategories()
  {
    return this.categories.length > 0
  }

  get isAnyFilteredCategories()
  {
    return this.filteredCategories.length > 0
  }

  /*----Filter Categories table on Search----*/ 
  filterCategories(categoryFilter: string) {
    
    if(this.categories.length > 0)
    {
      this.filteredCategories = this.categories;
      if(!isEmpty(categoryFilter))
        this.filteredCategories = this.categories
                                    .filter((category) =>
                                        compare(category.Name,categoryFilter));
    }
  }

  /*---update existing category---*/ 
  async OnUpdate(category:Category) {
    let isUpdated = await this.categoryService.update(category);
    if (isUpdated) 
    {
      this.isEditClicked=false;
    }   
    else
        showAlertOnAction("Category" , false, "update",this.router,"/admin/categories")
  }

  /*---Activate Category---*/ 
  async onActivate(product: Category) {
    let isActivated = await this.categoryService.activate(product.Id);
    if (isActivated) 
      product.IsActive = true;
    else
        showAlertOnAction("Category" , false, "activate",this.router,"/admin/categories")
  }

  /*---Deactivate Category---*/ 
  async onDeactivate(product: Category) {
    let isDeactivated = await this.categoryService.deactivate(product.Id);
    if (isDeactivated) 
        product.IsActive = false;
    else
        showAlertOnAction("Category" , false, "deactivate",this.router,"/admin/categories")
  }

  /*---Unsubscribe from category service once the component is destroyed---*/ 
  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
  }
}
