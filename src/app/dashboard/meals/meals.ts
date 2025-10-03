import { Component, OnInit } from '@angular/core';
import { MealService } from '../../Core/services/meal-service';
import { MainService } from '../../Core/services/main_service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

@Component({
  selector: 'app-meals',
  imports: [CommonModule,FormsModule],
  templateUrl: './meals.html',
  styleUrl: './meals.css'
})
export class Meals implements OnInit {

  mealDecorations: Record<MealType, { emoji: string; badge: string }> = {
  breakfast: { emoji: '🥞', badge: 'Popular' },
  lunch: { emoji: '🥗', badge: 'Healthy' },
  dinner: { emoji: '🍗', badge: 'Kids Favorite' },
  snack: { emoji: '🥤', badge: 'Quick' }
};

decorationKeys: MealType[] = Object.keys(this.mealDecorations) as MealType[];

getRandomDecoration(meal: any) {
  if (!meal._decoration) {
    const randomKey = this.decorationKeys[
      Math.floor(Math.random() * this.decorationKeys.length)
    ] as MealType;
    meal._decoration = this.mealDecorations[randomKey];
  }
  return meal._decoration;
}
  children: any[] = [];
  selectedChildId: number | null = null;

  meals: any[] = [];
  newMeal = { title: '', ingredients: '', recipe: '' };
  editingMeal: any = null;

  showAdd = false;

  constructor(
    private mealService: MealService,
    private mainService: MainService,
    private toastr: ToastrService
  ) {}

  showAddMealForm = false;

openAddMealForm() {
  this.showAddMealForm = true;
}

closeAddMealForm() {
  this.showAddMealForm = false;
  this.newMeal = { title: '', ingredients: '', recipe: '' };
}

  ngOnInit(): void {
    this.loadChildren();
  }

  loadChildren() {
    this.mainService.getFamily().subscribe({
      next: (family: any) => {
        // Assuming `family.children` is returned
        this.children = family.children || [];
        if (this.children.length > 0) {
          this.selectedChildId = this.children[0].id; // auto-select first child
          this.loadMeals();
        }
      },
      error: (err) => console.error('Error loading children:', err)
    });
  }

  onChildChange() {
    if (this.selectedChildId) {
      this.loadMeals();
    }
  }

  loadMeals() {
    if (!this.selectedChildId) return;
    this.mealService.getMealsByChild(this.selectedChildId).subscribe({
      next: (data) => (this.meals = data),
      error: (err) => console.error('Error loading meals:', err),
    });
  }

  addMeal() {
    if (!this.selectedChildId) return;
    this.mealService.addMeal(this.selectedChildId, this.newMeal).subscribe(() => {
      this.loadMeals();
      this.newMeal = { title: '', ingredients: '', recipe: '' };
      this.showAdd = false;
      this.toastr.success('Meal added successfully!', 'Success');

    });
  }

  editMeal(meal: any) {
    this.editingMeal = { ...meal };
  }

  updateMeal() {
    if (!this.selectedChildId || !this.editingMeal) return;
    this.mealService
      .editMealForChild(this.selectedChildId, this.editingMeal.id, this.editingMeal)
      .subscribe(() => {
        this.loadMeals();
        this.editingMeal = null;
        this.toastr.success('Meal updated successfully!', 'Success');
      });
  }

  deleteMeal(mealId: number) {
    if (!this.selectedChildId) return;
    this.mealService.deletemealforchild(this.selectedChildId, mealId).subscribe(() => {
      this.loadMeals();
      this.toastr.success('Meal deleted successfully!', 'Success');
    });

  }
    getAge(dateOfBirth: string): string {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const diff = today.getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  }
}