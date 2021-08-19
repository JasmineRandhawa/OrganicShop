import { Component, OnDestroy } from '@angular/core';
import {  Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/models/domain/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})

/*----Products table Component----*/
export class AdminProductsComponent  implements OnDestroy {

  /*---class property declarations---*/ 
  products : Product[] = [];
  filteredProducts : Product[] = [];
  productSubscription : Subscription | undefined;

  /*----Initialize data from API response----*/ 
  constructor(private productService : ProductService , private router : Router) {

    // get list of products from API to populate the table
    this.productSubscription =  this.productService
                                    .getAll()
                                    .subscribe((response:any) => 
                                    {
                                      this.products = this.filteredProducts = [];
                                      if(response && response.status == 200)
                                      {
                                        let products = response.body as Product[];
                                        if(products && products.length > 0)
                                            this.products = this.filteredProducts = products;
                                      }
                                    });    
  }

    /*---Check if any products are available---*/
    get isAnyProducts() : boolean
    {
      return this.products.length > 0
    }
  
    /*---Check if there are any products matching the search criteria---*/
    get isAnyFilteredProducts() : boolean
    {
      return this.filteredProducts.length > 0
    }
  
  /*----Filter Products table on Search----*/ 
  filterProducts(titleFilter : string , categoryFilter : string) : void {
    if(this.products.length > 0)
    {
      this.filteredProducts = this.products;
      
      if(!isEmpty(titleFilter)  && isEmpty(categoryFilter))
        this.filteredProducts = this.products
                                    .filter((product) =>
                                        compare(product.Title , titleFilter));

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
  async onActivate(product : Product) : Promise<void> {
    let isActivated = await this.productService.activate(product.Id);
    if (isActivated) 
      product.IsActive = true;
    else
        showAlertOnAction("Product" , false , "activate" , this.router , "/admin/products")
  }

  /*---Deactivate Product---*/ 
  async onDeactivate(product : Product) : Promise<void> {
    let isDeactivated = await this.productService.deactivate(product.Id);
    if (isDeactivated) 
        product.IsActive = false;
    else
        showAlertOnAction("Product" , false , "deactivate" , this.router , "/admin/products")
  }

  /*---Unsubscribe from product service once the component is destroyed---*/ 
  ngOnDestroy = () : void => this.productSubscription?.unsubscribe();
}
