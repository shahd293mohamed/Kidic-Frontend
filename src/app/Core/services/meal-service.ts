import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private baseUrl = 'http://localhost:8080/api/meals/children';
  constructor(private _http:HttpClient) { }

  getMealsByChild(childId: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.baseUrl}/${childId}`);
  }

  addMeal(childId: number, meal: any): Observable<any> {
    const formData = new FormData();
    if (meal.title) formData.append('title', meal.title);

    const ingredientsCsv = Array.isArray(meal.ingredients)
      ? meal.ingredients.join(',')
      : meal.ingredients;
    if (ingredientsCsv) formData.append('ingredients', ingredientsCsv);

    if (meal.recipe) formData.append('recipe', meal.recipe);

    return this._http.post<any>(`${this.baseUrl}/${childId}`, formData);
  }

  editMealForChild(childId: number, mealId: number, meal: any): Observable<any> {
    const formData = new FormData();
    if (meal.title) formData.append('title', meal.title);

    const ingredientsCsv = Array.isArray(meal.ingredients)
      ? meal.ingredients.join(',')
      : meal.ingredients;
    if (ingredientsCsv) formData.append('ingredients', ingredientsCsv);

    if (meal.recipe) formData.append('recipe', meal.recipe);

    return this._http.put<any>(`${this.baseUrl}/${childId}/${mealId}`, formData);
  }
  deletemealforchild(childId: number, mealId: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/${childId}/${mealId}`);
  }
  
}
