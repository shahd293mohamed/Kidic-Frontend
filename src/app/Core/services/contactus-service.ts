import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {
  private baseUrl = environment.apiUrl
  constructor(private _http:HttpClient) { }
 

  addReview(data:any){
    return this._http.post(`${this.baseUrl}/review`,data)
  }

  getnormalreviews(): Observable<Review[]>{
    return this._http.get<Review[]>(`${this.baseUrl}/review/normal-reviews`)
  }

  
}
