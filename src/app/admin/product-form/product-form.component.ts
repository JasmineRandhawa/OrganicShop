import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';

import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { CategoryDto } from 'src/app/models/category-dto';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
 /*---Product Form component for creating new product or updating existing product---*/ 
export class ProductFormComponent implements OnDestroy {

  /*---class property declarations---*/ 
  paramId: number = 0;
  categories: Category[] = [];
  currentProduct: Product  = new Product();
  productSubscription:Subscription | undefined;
  categoriesSubscription:Subscription | undefined;

  /*----initialize properties from firebase----*/ 
  constructor(private categoryService: CategoryService, private router: Router,
              private productService: ProductService, private route: ActivatedRoute) {

    //get param from the URL to get the product id for product to be updated    
    let paramValue = this.route.snapshot.paramMap.get("id");                                        
    this.paramId = paramValue ? (+paramValue) : 0;
    console.log(this.paramId);

    //get existing product from firebase matching the above param id                                 
    this.productSubscription =  this.productService
                                      .getById(this.paramId)
                                      .subscribe((response:any) => {
                                        if(response.status == 200)
                                        {
                                          let products = response.body as Product[];
                                          if(products && products.length > 0)
                                             this.currentProduct = products[0];
                                        }
                                        else
                                        { 
                                          console.log(response.status , response.body)
                                          alert("An unexpected error from API : Response Code: "+ response.status);
                                        }
                                      }); 

    // get product categories from firebase to populate product category dropdown
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

   /*---update selected category on category dropdown change---*/ 
  onCategoryChange(categoryValue:any)
  {
    let categoryId = this.categories
                  .filter((c)=>c.Name == categoryValue)
                  .map((c)=>c.Id)[0];
    if(categoryId)
      this.currentProduct.Category.Id = categoryId
  }

  /*---save new  or update existing product---*/ 
  async onSave(product: any) {
 
    let objToBeSaved =  { title : product.title.trim() , 
                          price : product.price, 
                          category : this.currentProduct.Category,
                          imageURL :product.imageURL.trim() };
    
    //update existing object
    if (this.paramId) {
      let updatedProduct = await this.productService.update(this.currentProduct);
      showAlertOnAction("Product", updatedProduct,"update",this.router,'/admin/products');
    }
    
    //save new object
    else {
      let newProduct = await this.productService.update(this.currentProduct);
      showAlertOnAction("Product", newProduct,"save",this.router,'/admin/products');
    }
  }

  /*---unsubscribe from product service on component destruction---*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }
}
