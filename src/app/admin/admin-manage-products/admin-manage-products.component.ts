import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { compare , isEmpty , showAlertOnAction } from 'src/app/utility/helper';

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableParams, DataTableResource } from 'angular5-data-table'

import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-manage-products',
  templateUrl: './admin-manage-products.component.html',
  styleUrls: ['./admin-manage-products.component.css']
})

/*----Products DataTable Component with pagination sorting----*/
export class AdminManageProductsComponent implements  OnDestroy {

  /*----property declarations----*/ 
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSubscription: Subscription | undefined;
  activationSubscription:Subscription | undefined;
  items: Product[] = [];
  itemsCount:number = 0;
  tableResource:DataTableResource<Product> | undefined;

  /*----Initialize properties from firebase database----*/ 
  constructor(private productService: ProductService, private router:Router ) {

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
                                            this.initializeDataTable(this.products); 
                                      }
                                      else
                                      { 
                                        console.log(response.status , response.body)
                                        alert("An unexpected error from API : Response Code: "+ response.status);
                                      }
                                    });                                 
  }

  /*----initialize table or reload datatable after search filters----*/ 
  private initializeDataTable(products:Product[])
  {
    this.tableResource = new DataTableResource(products);
    this.tableResource?.query({offset:0})
                      .then(items=> this.items = items);
    this.tableResource?.count()
                      .then(count=> this.itemsCount = count);
  }

  /*----reload datatable after rezeing, pagination or sorting----*/ 
  reloadItems(params:DataTableParams) : void 
  {
    if(!this.tableResource) return;

    this.tableResource?.query(params)
                       .then(items=> this.items = items);
  }

  /*----navigate to image in new tab----*/ 
  onNavigate(imageURL:string){
    window.open(imageURL, "_blank");
  }

  /*----Filter Products table on Search----*/ 
  filterProducts(titleFilter: string , categoryFilter: string) {
    if(this.products)
    {
      let filteredProducts:Product[] = this.products;
      
      if(!isEmpty(titleFilter)  && isEmpty(categoryFilter))
        filteredProducts = this.products.filter((product)=> compare(product.Title,titleFilter));

      else if(!isEmpty(categoryFilter) && isEmpty(titleFilter))
        filteredProducts = this.products.filter((product)=> 
                                                compare(product.Category.Name , categoryFilter));
      else if (!isEmpty(categoryFilter) && !isEmpty(titleFilter))
        filteredProducts = this.products.filter((product) => 
                                                compare(product.Title , titleFilter) &&
                                                compare(product.Category.Name , categoryFilter));
      this.initializeDataTable(filteredProducts);                                          
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
  /*---unsubscribe from product service on component destruction---*/ 
  ngOnDestroy(): void {
    this.productSubscription?.unsubscribe();
    this.activationSubscription?.unsubscribe();
  }
}
