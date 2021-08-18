import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { DataTableModule } from 'angular5-data-table';

import { AppComponent } from 'src/app/app.component';
import { components, routes, services } from 'src/app/app-module-lists';
import { NavbarComponent } from 'src/app/navbar/navbar.component';
import { HomeComponent } from 'src/app/home/home.component';
import { ProductsComponent } from 'src/app/shopping/products/products.component';
import { ShoppingCartComponent } from 'src/app/shopping/shopping-cart/shopping-cart.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';

import { LoginComponent } from 'src/app/login/login.component';
import { CheckOutComponent } from 'src/app/shopping/check-out/check-out.component';
import { MyOrdersComponent } from 'src/app/shopping/my-orders/my-orders.component';
import { NotAdminComponent } from 'src/app/not-admin/not-admin.component';

import { AdminProductsComponent } from 'src/app/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from 'src/app/admin/admin-orders/admin-orders.component';
import { ProductFormComponent } from 'src/app/admin/product-form/product-form.component';
import { AdminManageProductsComponent } from 'src/app/admin/admin-manage-products/admin-manage-products.component';
import { ProductFilterComponent } from 'src/app/shopping/products/product-filter/product-filter.component';
import { ProductCardComponent } from 'src/app/shopping/products/product-card/product-card.component';
import { QuantityCardComponent } from 'src/app/shopping/quantity-card/quantity-card.component'
import { AdminCategoriesComponent } from './admin/admin-categories/admin-categories.component';
import { CategoryFormComponent } from './admin/category-form/category-form.component';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    NotFoundComponent,

    LoginComponent,
    CheckOutComponent,
    MyOrdersComponent,
    NotAdminComponent,

    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    CategoryFormComponent,
    AdminManageProductsComponent,
    ProductFilterComponent,
    ProductCardComponent,
    QuantityCardComponent
  ] ,
  
  imports: [
    BrowserModule,  
    HttpClientModule,
    NgbModule,

    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule ,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    DataTableModule,

    RouterModule.forRoot(routes)
  ],

  providers: services,

  bootstrap: [AppComponent]

})

export class AppModule { }
