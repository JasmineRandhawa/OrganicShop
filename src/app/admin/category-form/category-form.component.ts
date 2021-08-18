import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { showAlertOnAction } from 'src/app/utility/helper';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {

  category : Category = new Category();

  /*----initialize properties from firebase----*/ 
  constructor(private categoryService: CategoryService, private router: Router) {   
  }

  /*---add new category---*/ 
  async onSave(category:Category) {
    let isSaved = await this.categoryService.add(category);
    showAlertOnAction("Category" , isSaved, "create",this.router,"/admin/categories")
  }
  

}
