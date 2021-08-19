import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoryDto } from 'src/app/models/data-transfer-objects/ApiResponses/category-dto';
import { Category } from 'src/app/models/domain/category';
import { Product } from 'src/app/models/domain/product';

import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { showAlertOnAction } from 'src/app/utility/helper';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
 /*---Product Form component for creating new product or updating existing product---*/ 
export class ProductFormComponent implements OnDestroy {

  /*---class property declarations---*/ 
  paramId : number = 0;
  categories : Category[] = [];
  currentProduct : Product  = new Product();
  productSubscription : Subscription | undefined;
  categoriesSubscription : Subscription | undefined;

  /*----initialize data from API response----*/ 
  constructor(private categoryService : CategoryService, private router : Router,
              private productService : ProductService, private route : ActivatedRoute) {
 
    let paramValue = this.route.snapshot.paramMap.get("id");                                        
    this.paramId = paramValue ? (+paramValue) : 0;
    
    if(this.paramId > 0)
    {
      //get existing product from API matching the above param id                                 
      this.productSubscription =  this.productService
                                      .getById(this.paramId)
                                      .subscribe((response : any) => {
                                        if(response.status == 200)
                                        {
                                          let products = response.body as Product[];
                                          if(products && products.length > 0)
                                             this.currentProduct = products[0];
                                        }
                                      }); 
    }
    else
      this.currentProduct.IsActive = true;

    // get product categories from firebase to populate product category dropdown
    this.categoriesSubscription = this.categoryService
                                      .getAll()
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

   /*---update selected category on category dropdown change---*/ 
  onCategoryChange(categoryValue : any) : void
  {
    let categoryId = this.categories
                  .filter((c)=>c.Name == categoryValue)
                  .map((c)=>c.Id)[0];
    if(categoryId)
      this.currentProduct.Category.Id = categoryId
  }

  /*---save new  or update existing product---*/ 
  async onSave(product : any) : Promise<void> {

    let objToBeSaved =  { Title : product.title.trim() , 
                          Price : product.price, 
                          CategoryId : this.currentProduct.Category.Id,
                          ImageURL : product.imageURL.trim(), 
                          IsActive: product.isActive
                        };
    

    //update existing object
    if (this.paramId) {
      let updatedProduct = await this.productService.update(objToBeSaved);
      showAlertOnAction("Product", updatedProduct , "update" , this.router , '/admin/products');
    }
    
    //save new object
    else {
      let newProduct = await this.productService.add(objToBeSaved);
      showAlertOnAction("Product", newProduct , "create", this.router , '/admin/products');
    }
  }

  /*---unsubscribe from product service on component destruction---*/ 
  ngOnDestroy() : void {
    this.productSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
