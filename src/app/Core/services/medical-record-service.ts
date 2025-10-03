import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImedicalRecord } from '../model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl =  environment.apiUrl +'/medical-records';

  constructor(private http: HttpClient) {}

  getMedicalRecordsByChild(childId: number): Observable<ImedicalRecord[]> {
    return this.http.get<ImedicalRecord[]>(`${this.baseUrl}/children/${childId}`);
  }
  getMedicalRecord(id: number): Observable<ImedicalRecord> {
    return this.http.get<ImedicalRecord>(`${this.baseUrl}/${id}`);
  }

 
  addMedicalRecord(childId: number,record: ImedicalRecord): Observable<ImedicalRecord> {
    return this.http.post<ImedicalRecord>(`${this.baseUrl}/children/${childId}`, record);
  }

  updateMedicalRecord(id: number, record: ImedicalRecord): Observable<ImedicalRecord> {
    return this.http.put<ImedicalRecord>(`${this.baseUrl}/${id}`, record);
  }

  deleteMedicalRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
