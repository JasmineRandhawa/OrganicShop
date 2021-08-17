import { Category } from 'src/app/models/category';
import { CategoryDto } from 'src/app/models/category-dto';
import { CATEGORY_ALL } from 'src/app/utility/constants';
import { CategoryService } from 'src/app/services/category.service';

import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})

/*---Products category filter---*/
export class ProductFilterComponent{

   /*---class property declarations---*/ 
  categories: Category[] = [];
  defaultCategory = CATEGORY_ALL
  categoriesSubscription:Subscription | undefined;
  @Input('category') category:string = this.defaultCategory;

  /*----subscribe to query param----*/ 
  constructor(private categoryService: CategoryService) 
  {
    // get product categories from firebase to populate product category list
    this.categoriesSubscription = this.categoryService
                                      .getAllActive()
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
                                            })
                                          }
                                        }
                                        else
                                        { 
                                          console.log(response.status , response.body)
                                          alert("An unexpected error from API : Response Code: "+ response.status);
                                        }
                                      });  
                            
  }

  /*---unsubscribe from category service on component destruction---*/ 
  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }
}
