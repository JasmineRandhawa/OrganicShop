import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { CATEGORY_ALL } from 'src/app/utility/constants';
import { Category } from 'src/app/models/domain/category';
import { CategoryDto } from 'src/app/models/data-transfer-objects/ApiResponses/category-dto';

import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})

/*---Products category filter---*/
export class ProductFilterComponent{

   /*---class property declarations---*/ 
  defaultCategory = CATEGORY_ALL
  @Input('category') category : string = this.defaultCategory;
  categories: Category[] = [];
  categoriesSubscription : Subscription | undefined;

  /*----subscribe to query param----*/ 
  constructor(private categoryService: CategoryService) 
  {
    // get product categories from firebase to populate product category list
    this.categoriesSubscription = this.getCategorySubscription() 
                            
  }
  getCategorySubscription() : Subscription | undefined {
    return this.categoryService.getAllActive()
                                .subscribe((response : any) =>  {
                                  if(response.status == 200)
                                  {
                                    let categoriesResponse = response.body as CategoryDto[];
                                    if(categoriesResponse && categoriesResponse.length > 0)
                                    {
                                      categoriesResponse.map((categoryDto : CategoryDto)=>
                                      {
                                        let category : Category = new Category(categoryDto)
                                        this.categories?.push(category);
                                      })
                                    }
                                  }
                                }); 
  }

  /*---unsubscribe from category service on component destruction---*/ 
  ngOnDestroy = () :void => this.categoriesSubscription?.unsubscribe();

}
