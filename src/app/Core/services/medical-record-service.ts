// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class MedicalRecordService {
  
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImedicalRecord } from '../model';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private baseUrl = 'http://localhost:8080/api/medical-records';

  constructor(private http: HttpClient) {}

  // Get all medical records for a specific child
  getMedicalRecordsByChild(childId: number): Observable<ImedicalRecord[]> {
    return this.http.get<ImedicalRecord[]>(`${this.baseUrl}/children/${childId}`);
  }

  // Get a single record
  getMedicalRecord(id: number): Observable<ImedicalRecord> {
    return this.http.get<ImedicalRecord>(`${this.baseUrl}/${id}`);
  }

  // Add a new medical record
  addMedicalRecord(childId: number,record: ImedicalRecord): Observable<ImedicalRecord> {
    return this.http.post<ImedicalRecord>(`${this.baseUrl}/children/${childId}`, record);
  }

  // Update an existing record
  updateMedicalRecord(id: number, record: ImedicalRecord): Observable<ImedicalRecord> {
    return this.http.put<ImedicalRecord>(`${this.baseUrl}/${id}`, record);
  }

  // Delete a record
  deleteMedicalRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
