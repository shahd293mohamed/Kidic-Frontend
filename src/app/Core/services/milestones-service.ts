import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Milestone } from '../model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MilestonesService {
  private baseUrl =  environment.apiUrl+'/milestones'

  constructor(private _http:HttpClient) { }

  getmilestonesByChild(childId: number): Observable<Milestone[]> {
    return this._http.get<Milestone[]>(`${this.baseUrl}/child/${childId}`);
  }

  createMilestone(milestone: Milestone): Observable<Milestone> {
    return this._http.post<Milestone>(`${this.baseUrl}`, milestone);
  }

  updateMilestone(id: number, milestone: Partial<Milestone>): Observable<Milestone> {
    return this._http.put<Milestone>(`${this.baseUrl}/${id}`, milestone);
  }

   markAsCompleted(id: number, completionDate?: string): Observable<Milestone> {
    let url = `${this.baseUrl}/${id}/complete`;
    if (completionDate) {
      url += `?completionDate=${completionDate}`;
    }
    return this._http.put<Milestone>(url, {});
  }

  deleteMilestone(id: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${id}`);
  }
    generateBuiltInMilestones(childId: number): Observable<string> {
    return this._http.post<string>(`${this.baseUrl}/generate/${childId}`, {});
  }
  
}
