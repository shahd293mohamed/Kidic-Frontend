import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  private baseUrl = environment.apiUrl + '/vaccines'

  constructor(private _http:HttpClient) { }

  getVaccinesByChild(childId: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.baseUrl}/children/${childId}`);
  }
  generateDefaultVaccines(childId: number): Observable<any> {
    return this._http.post<any>(`${this.baseUrl}/children/${childId}/generate-default`, {});
  }

  addVaccine(childId: number, vaccine: any): Observable<any> {
    return this._http.post<any>(`${this.baseUrl}/children/${childId}`, vaccine);
  }

  updateVaccine(vaccineId: number, vaccine: any): Observable<any> {
    return this._http.put<any>(`${this.baseUrl}/${vaccineId}`, vaccine);
  }

  deleteVaccine(vaccineId: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/${vaccineId}`);
  }
  
}
