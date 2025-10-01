import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://127.0.0.1:8000/api/chat';

  constructor(private _http:HttpClient) { }

  sendMessage(message: string, userId: number=4): Observable<any> {
     return this._http.post<any>(this.baseUrl, {
      message,
      user_id: userId   
    });
  }

  
}
