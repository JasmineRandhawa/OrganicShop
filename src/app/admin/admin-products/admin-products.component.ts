import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import {  Router } from '@angular/router';

import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

/*----Products table Component----*/
export class AdminProductsComponent  implements OnDestroy{

  /*---class property declarations---*/ 
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSubscription: Subscription | undefined;

  /*----Initialize properties from firebase database----*/ 
  constructor(private productService: ProductService, private router:Router) {

    // get list of products from firebase to populate the table
    this.productSubscription =  this.productService
                                    .getAll()
                                    .subscribe((response:any) => 
                                    {
                                      if(response.status == 200)
                                      {
                                        let products = response.body as Product[];
                                        if(products && products.length > 0)
                                            this.products = this.filteredProducts = products;
                                      }
                                      else
                                      { 
                                        console.log(response.status , response.body)
                                        alert("An unexpected error from API : Response Code: "+ response.status);
                                      }
                                    });    
  }

    /*---Check if any categories are available---*/
    get isAnyProducts()
    {
      return this.products.length > 0
    }
  
    get isAnyFilteredProducts()
    {
      return this.filteredProducts.length > 0
    }
  
  /*----Filter Products table on Search----*/ 
  filterProducts(titleFilter: string , categoryFilter: string) {
    if(this.products.length > 0)
    {
      this.filteredProducts = this.products;
      
      if(!isEmpty(titleFilter)  && isEmpty(categoryFilter))
        this.filteredProducts = this.products
                                    .filter((product) =>
                                        compare(product.Title,titleFilter));

      else if(!isEmpty(categoryFilter) && isEmpty(titleFilter))
        this.filteredProducts = this.products
                                    .filter((product)=> 
                                        compare(product.Category.Name , categoryFilter));
     
      else if (!isEmpty(categoryFilter) && !isEmpty(titleFilter))
        this.filteredProducts = this.products
                                    .filter((product) => 
                                      compare(product.Title , titleFilter) &&
                                      (compare(product.Category.Name , categoryFilter)));
    }
  }

  /*---Activate Product---*/ 
  async onActivate(product: Product) {
    let isActivated = await this.productService.activate(product.Id);
    if (isActivated) 
      product.IsActive = true;
    else
        showAlertOnAction("Product" , false, "activate",this.router,"/admin/products")
  }

  /*---Deactivate Product---*/ 
  async onDeactivate(product: Product) {
    let isDeactivated = await this.productService.deactivate(product.Id);
    if (isDeactivated) 
        product.IsActive = false;
    else
        showAlertOnAction("Product" , false, "deactivate",this.router,"/admin/products")
  }

  /*---Unsubscribe from product service once the component is destroyed---*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
  }
}
