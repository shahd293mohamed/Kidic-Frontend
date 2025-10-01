import { Component, OnInit } from '@angular/core';
import { MedicalRecordService } from '../../Core/services/medical-record-service';
import { ImedicalRecord } from '../../Core/model';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule} from '@angular/forms';

@Component({
  selector: 'app-medical-record',
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-record.html',
  styleUrl: './medical-record.css'
})
export class MedicalRecord implements OnInit {
  medicalRecords: ImedicalRecord[] = [];
  newRecord: ImedicalRecord = {
    type: 'VACCINATION',
    dateOfRecord: '',
    description: '',
    status: 'ACTIVE',
    childId: 0
  };
  selectedChildId = 4; // Example, dynamically change it

  constructor(private medicalRecordService: MedicalRecordService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.medicalRecordService.getMedicalRecordsByChild(this.selectedChildId)
      .subscribe(data => {
        this.medicalRecords = data;
      });
  }

  addRecord(): void {
    if (!this.newRecord.childId) {
      this.newRecord.childId = this.selectedChildId;
    }

    this.medicalRecordService.addMedicalRecord(this.selectedChildId,this.newRecord)
      .subscribe(record => {
        this.medicalRecords.push(record);
        this.resetForm();
      });
  }

  deleteRecord(id: number): void {
    this.medicalRecordService.deleteMedicalRecord(id).subscribe(() => {
      this.medicalRecords = this.medicalRecords.filter(record => record.id !== id);
    });
  }

  resetForm(): void {
    this.newRecord = {
      type: 'VACCINATION',
      dateOfRecord: '',
      description: '',
      status: 'ACTIVE',
      childId: this.selectedChildId
    };
  }
}

