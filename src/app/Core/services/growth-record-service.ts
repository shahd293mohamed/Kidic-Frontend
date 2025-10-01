import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GrowthRecord } from '../model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrowthRecordService {
  private apiUrl = 'http://localhost:8080/api/growth-records'; // adjust as needed

  constructor(private http: HttpClient) {}

  getGrowthRecordsByChild(childId: number): Observable<GrowthRecord[]> {
    return this.http.get<GrowthRecord[]>(`${this.apiUrl}/children/${childId}`);
  }

  // addGrowthRecord(childId: number,record: GrowthRecord): Observable<GrowthRecord> {
  //   return this.http.post<GrowthRecord>(`${this.apiUrl}/children/${childId}`, record);
  // }
  addGrowthRecord(childId: number, record: any): Observable<any> {
   const formData = new FormData();
  formData.append('dateOfRecord', record.dateOfRecord);
  formData.append('type', record.type);
  formData.append('status', record.status);
  if (record.additionalInfo) formData.append('additionalInfo', record.additionalInfo);
  if (record.height !== undefined) formData.append('height', record.height.toString());
  if (record.weight !== undefined) formData.append('weight', record.weight.toString());

  return this.http.post<GrowthRecord>(`${this.apiUrl}/children/${childId}`, formData);
  }


  updateGrowthRecord(id: number, record: GrowthRecord): Observable<GrowthRecord> {
    return this.http.put<GrowthRecord>(`${this.apiUrl}/${id}`, record);
  }

  deleteGrowthRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
