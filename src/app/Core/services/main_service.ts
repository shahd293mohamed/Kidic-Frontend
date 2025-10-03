import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getParent(): Observable<any> {
    return this._http.get(`${this.baseUrl}/parent`);
  }

  getChildren(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/child/${id}`);
  }

  getMedicalRecords(childId: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/medical-records/children/${childId}`);
  }
  addChild(child: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/child`, child);
  }
  getFamily(): Observable<any> {
  return this._http.get(`${this.baseUrl}/family`);
}
updateChild(id: number, child: any): Observable<any> {
  return this._http.put(`${this.baseUrl}/child/${id}`, child);
}
deleteChild(id: number): Observable<any> {
  return this._http.delete(`${this.baseUrl}/child/${id}`, { responseType: 'text' });
  
}

updateparent(parent: any): Observable<any> {
  return this._http.put(`${this.baseUrl}/parent`, parent);
}

  
}
