import { Component, OnInit } from '@angular/core';
import { MainService } from '../../Core/services/main_service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrowthRecordService } from '../../Core/services/growth-record-service';
import { MedicalRecordService } from '../../Core/services/medical-record-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main implements OnInit {
  parent: any = null;
  children: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  showAddChildForm: boolean = false;
  medicalRecords: any[] = [];
  growthRecords: any[] = [];

  newChild = {
    name: '',
    gender: true,
    dateOfBirth: '',
    medicalNotes: ''
  };

  constructor(private mainService: MainService, private router: Router,  private medicalRecordService: MedicalRecordService,
    private growthRecordService: GrowthRecordService) {}

  ngOnInit(): void {
    this.loadFamilyData();
  }

 
  loadFamilyData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.mainService.getFamily().subscribe({
      next: (familyData) => {
        console.log("Family Data:", familyData);

        this.parent = familyData.parents.length > 0 ? familyData.parents[0] : null;

        this.children = (familyData.children || []).map((child: any) => ({
          ...child,
          age: this.calculateAge(child.dateOfBirth)
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error fetching family data:", err);
        this.errorMessage = 'Failed to load family information.';
        this.isLoading = false;
      }
    });
  }

  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

 
  openAddChildForm() {
    this.showAddChildForm = true;
     this.medicalRecords = [];
    this.growthRecords = [];
  }


  closeAddChildForm() {
    this.showAddChildForm = false;
    this.resetForm();
  }
  resetForm() {
    this.newChild = {
      name: '',
      gender: true,
      dateOfBirth: '',
      medicalNotes: ''
    };
  }

    addMedicalRecord() {
    this.medicalRecords.push({
      type: 'CHECKUP',
      dateOfRecord: new Date().toISOString().substring(0, 10),
      description: '',
      status: 'ACTIVE'
    });
  }

  removeMedicalRecord(index: number) {
    this.medicalRecords.splice(index, 1);
  }

  // Manage growth records
  addGrowthRecord() {
    this.growthRecords.push({
      dateOfRecord: new Date().toISOString().substring(0, 10),
      type: 'PHYSICAL',
      status: 'NOT_ACHIEVED',
      height: null,
      weight: null,
      additionalInfo: ''
    });
  }

  removeGrowthRecord(index: number) {
    this.growthRecords.splice(index, 1);
  }
  saveChild() {
  this.mainService.addChild(this.newChild).subscribe({
    next: (createdChild) => {
      const childId = createdChild.id;

      // Prepare API calls
      const medicalCalls = this.medicalRecords.map(record =>
        this.medicalRecordService.addMedicalRecord(childId, { ...record, childId })
      );

      const growthCalls = this.growthRecords.map(record =>
        this.growthRecordService.addGrowthRecord(childId, { ...record, childId })
      );

      // Run all calls
      forkJoin([...medicalCalls, ...growthCalls]).subscribe({
        next: () => {
          // ✅ Update UI without reloading
          this.children.push({
            ...createdChild,
            age: this.calculateAge(createdChild.dateOfBirth)
          });

          console.log('Child and all records saved successfully');

          this.closeAddChildForm(); // Close modal
        },
        error: (err) => {
          console.error('Error saving records:', err);
        }
      });
    },
    error: (err) => {
      console.error('Error creating child:', err);
    }
  });
}

    viewChildProfile(childId: number) {
    this.router.navigate([`/dashboard/profile`]);
  }
}

