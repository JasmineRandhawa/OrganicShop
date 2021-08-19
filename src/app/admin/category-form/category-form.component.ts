import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CategoryDto } from 'src/app/models/data-transfer-objects/ApiResponses/category-dto';
import { Category } from 'src/app/models/domain/category';

import { CategoryService } from 'src/app/services/category.service';
import { showAlertOnAction } from 'src/app/utility/helper';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {

  category : CategoryDto = new CategoryDto();

  /*----initialize data from API response----*/ 
  constructor(private categoryService : CategoryService , private router : Router) {   
  }

  /*---add new category---*/ 
  async onSave(categoryDto : CategoryDto) : Promise<void>  {
    let category : Category = new Category(categoryDto);
    let isSaved = await this.categoryService.add(category);
    showAlertOnAction("Category" , isSaved , "create" , this.router , "/admin/categories")
  }
}
