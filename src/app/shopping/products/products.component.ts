import { Component, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/models/domain/product';
import { ShoppingCartResponseDto } from 'src/app/models/data-transfer-objects/ApiResponses/shopping-cart-dto';
import { ShoppingCartItemDto } from 'src/app/models/data-transfer-objects/ApiResponses/shopping-cart-item-dto';
import { AppUser } from 'src/app/models/domain/app-user';

import { AuthService } from './../../services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

import { CATEGORY_ALL } from 'src/app/utility/constants';
import { compare } from 'src/app/utility/helper';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
/*---Products list for adding to cart---*/
export class ProductsComponent implements OnDestroy {

  /*---class property declarations---*/
  defaultCategory = CATEGORY_ALL
  @Input('category') category : string = this.defaultCategory;

  appUser : AppUser = new AppUser();
  cart : ShoppingCartResponseDto | null = null;
  items : ShoppingCartItemDto[] = [];
  filteredItems : ShoppingCartItemDto[] = [];

  categorySubscription : Subscription;
  productSubscription : Subscription | undefined;
  cartSubscription : Subscription | undefined;
  userSubscription : Subscription | undefined;

  /*---subscribe to query param, auth and products service---*/
  constructor(private productService : ProductService , private route : ActivatedRoute ,
              private authService : AuthService ,
              private cartService : ShoppingCartService) {

    this.userSubscription = this.authService
                                .appUser$
                                .subscribe((appUser : AppUser | null) => {
                                  if (appUser) {
                                    Object.assign(this.appUser,appUser)
                                    this.productSubscription = this.productService
                                                                    .getAllActive()
                                                                    .subscribe((response : any) => {
                                                                      if (response && response.status == 200)
                                                                        this.initializeData(response.body, appUser)
                                                                      }
                                                                    );
                                  }
                                });

    this.categorySubscription = this.route.queryParamMap
                                          .subscribe(params => {
                                            this.category = params.get('category') || this.defaultCategory;
                                            this.filterProducts(this.category);
                                          });
  }

  /*---Initialize data from Cart and Product Service---*/
  initializeData(products : Product[] , appUser : AppUser) : void {
    this.items = [];
    this.filteredItems = [];

    if (products && products.length > 0) {
      this.populateItems(products);
      this.cartSubscription = this.cartService
                                  .getCartByUser(appUser.AppUserId)
                                  .subscribe((response : any) => {
                                    if (response && response.status == 200) {
                                      let shoppingCartDto = response.body as ShoppingCartResponseDto
                                      this.cart = shoppingCartDto;
                                      this.updateCartDataIntoItems();
                                    }
                                  });    
   }
  }

  
  populateItems(products : Product[]) : void {
    for (let product of products) {
      let shoppingCartItemDto = new ShoppingCartItemDto(0, 0,product)
      this.items.push(shoppingCartItemDto);
      this.filteredItems.push(shoppingCartItemDto);
    }
    this.filterProducts(this.category);
  }

  updateCartDataIntoItems() : void {
    this.items.forEach((item) => {
      if (this.cart) {
        let cartItem = this.cart.items.filter(cartItem => cartItem.product.id == item.product.id)[0];
        if (cartItem) {
          item.quantity = cartItem.quantity;
          item.id = cartItem.id;
          item.shoppingCartId = cartItem.shoppingCartId;
        }
      }
      else
        item.shoppingCartId = 0;
    });
    this.filteredItems = [...this.items];
  }

  /*---Check if any products are available---*/
  get isAnyItems() : boolean {
    return this.filteredItems.length > 0;
  }

  /*---Filter Products table on Search---*/
  filterProducts(categoryFilter: string) : void {
    if (categoryFilter === this.defaultCategory)
      this.filteredItems = this.items;
    else
      this.filteredItems = this.items
        .filter((item) =>
          compare(item.product.category, categoryFilter));
  }

  /*---unsubscribe from services once component is destroyed---*/
  ngOnDestroy() : void {
    this.cartSubscription?.unsubscribe();
    this.productSubscription?.unsubscribe();
    this.categorySubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}