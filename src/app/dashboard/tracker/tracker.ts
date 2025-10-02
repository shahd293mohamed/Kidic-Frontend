import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MainService } from '../../Core/services/main_service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GrowthRecordService } from '../../Core/services/growth-record-service';
import { GrowthRecord, Milestone } from '../../Core/model';
import { VaccineService } from '../../Core/services/vaccine-service';
import { MilestonesService } from '../../Core/services/milestones-service';
interface PercentileData {
  P3: number;
  P50: number;
  P97: number;
}

const referenceHeights: Record<number, PercentileData> = {
  0: { P3: 50, P50: 55, P97: 60 },
  1: { P3: 70, P50: 75, P97: 80 },
  2: { P3: 80, P50: 85, P97: 90 },
  3: { P3: 85, P50: 90, P97: 95 },
  4: { P3: 90, P50: 95, P97: 100 },
  5: { P3: 95, P50: 100, P97: 105 },
};

const referenceWeights: Record<number, PercentileData> = {
  0: { P3: 4, P50: 6, P97: 8 },
  1: { P3: 8, P50: 10, P97: 12 },
  2: { P3: 10, P50: 12, P97: 14 },
  3: { P3: 12, P50: 14, P97: 16 },
  4: { P3: 14, P50: 16, P97: 18 },
  5: { P3: 16, P50: 18, P97: 20 },
};

@Component({
  selector: 'app-tracker',
  imports: [FormsModule,CommonModule],
  templateUrl: './tracker.html',
  styleUrl: './tracker.css'
})
export class Tracker implements OnInit  {
  activeTab: string = 'milestones';

setActiveTab(tab: string) {
  this.activeTab = tab;
}

   children: any[] = [];
    isLoading: boolean = true;
    errorMessage: string = '';
    selectedChild: number = 0;
    growthRecords: GrowthRecord[] = [];
    milestones: Milestone[] = [];

    vaccines: any[] = [];
    newVaccine: any = { name: '', status: 'due', date: '' };
    editingVaccine: any = null;
    newChild = {
    name: '',
    gender: true,
    dateOfBirth: '',
    medicalNotes: ''
  };
  heightPercentile: number | null = null;
  weightPercentile: number | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef, 
    private mainService: MainService, private growthService: GrowthRecordService,
     private vaccineService: VaccineService,private milestoneService: MilestonesService) {}
  ngOnInit(): void {
    this.loadFamilyData();
    this.loadGrowthRecords();
    this.loadVaccines();
    this.loadMilestones()

  }

    loadVaccines(): void {
    this.vaccineService.getVaccinesByChild(this.selectedChild).subscribe({
      next: (data) => {this.vaccines = data; console.log('child id shososo', this.selectedChild);},
      error: (err) => console.error('Error loading vaccines', err)   });
  }

  recordVaccine(): void {
  if (this.editingVaccine) {
    // update existing vaccine
    this.vaccineService.updateVaccine(this.editingVaccine.id, this.newVaccine).subscribe({
      next: () => {
        this.loadVaccines();
        this.cancelEdit();
        this.closeAddVaccineForm(); // Close modal after update
      },
      error: (err) => console.error('Error updating vaccine', err)
    });
  } else {
    // add new vaccine
    this.vaccineService.addVaccine(this.selectedChild, this.newVaccine).subscribe({
      next: () => {
        this.loadVaccines();
        this.newVaccine = { name: '', status: 'due', date: '' }; // reset form
        this.closeAddVaccineForm(); // Close modal after save
      },
      error: (err) => console.error('Error adding vaccine', err)
    });
  }
}

editVaccine(vaccine: any): void {
  this.editingVaccine = vaccine;
  this.newVaccine = { ...vaccine }; // copy values into form
  this.openAddVaccineForm(); // Open modal for editing
}

cancelEdit(): void {
  this.editingVaccine = null;
  this.newVaccine = { name: '', status: 'due', date: '' };
  this.closeAddVaccineForm();
}

closeAddVaccineForm(): void {
  this.showAddVaccineForm = false;
  this.editingVaccine = null;
  this.newVaccine = { name: '', status: 'due', date: '' };
}
  deleteVaccine(vaccineId: number): void {
    if (confirm('Are you sure you want to delete this vaccine?')) {
      this.vaccineService.deleteVaccine(vaccineId).subscribe({
        next: () => this.loadVaccines(),
        error: (err) => console.error('Error deleting vaccine', err)
      });
    }
  }

  latestHeight: number | undefined;
  latestWeight: number | undefined;
  lastUpdatedHeight: string = '';
  lastUpdatedWeight: string = '';

  calculateHeightPercentile(age: number, height: number): number | null {
  const ref = referenceHeights[age];
  if (!ref) return null; 

  if (height < ref.P3) return 3;
  if (height < ref.P50) return 50;
  return 97;
}
calculateWeightPercentile(age: number, weight: number): number | null {
  const ref = referenceWeights[age];
  if (!ref) return null; 

  if (weight < ref.P3) return 3;
  if (weight < ref.P50) return 50;
  return 97;
}


loadGrowthRecords(): void {
  this.growthService.getGrowthRecordsByChild(this.selectedChild).subscribe(records => {
    console.log('Growth Records:', records);

    this.growthRecords = records;

    const sorted = [...records].sort((a, b) =>
      new Date(b.dateOfRecord).getTime() - new Date(a.dateOfRecord).getTime()
    );

    const latestHeightRecord = sorted.find(r => r.height !== null && r.height !== undefined);
    const latestWeightRecord = sorted.find(r => r.weight !== null && r.weight !== undefined);

    this.latestHeight = latestHeightRecord?.height ?? undefined;
    this.lastUpdatedHeight = latestHeightRecord?.dateOfRecord || '';

    this.latestWeight = latestWeightRecord?.weight ?? undefined;
    this.lastUpdatedWeight = latestWeightRecord?.dateOfRecord || '';


    console.log('Children Array:', this.children);
    console.log('Selected Child ID:', this.selectedChild);
    const selectedChildObj = this.children.find(c => c.id === this.selectedChild);
    const age = selectedChildObj?.dateOfBirth
  ? this.calculateAge(selectedChildObj.dateOfBirth)
  : 0;

    console.log('Selected Child:', selectedChildObj);
    console.log('Age (Rounded):', age);

    this.heightPercentile = this.latestHeight != null
      ? this.calculateHeightPercentile(age, this.latestHeight)
      : null;

    this.weightPercentile = this.latestWeight != null
      ? this.calculateWeightPercentile(age, this.latestWeight)
      : null;

    console.log('Height Percentile:', this.heightPercentile);
    console.log('Weight Percentile:', this.weightPercentile);
  });
}

  loadFamilyData() {
  this.isLoading = true;
  this.errorMessage = '';

  this.mainService.getFamily().subscribe({
    next: (familyData) => {
      this.children = (familyData.children || []).map((child: any) => ({
        ...child,
        age: this.calculateAge(child.dateOfBirth)
      }));

      // ✅ Set selectedChild to first child (or any logic you prefer)
      if (this.children.length > 0) {
        this.selectedChild = this.children[0].id;
        this.loadGrowthRecords(); // ✅ Now it's safe to load
        this.loadVaccines();
        this.loadMilestones();
      }

      this.isLoading = false;
    },
    error: (err) => {
      console.error("Error fetching family data:", err);
      this.errorMessage = 'Failed to load family information.';
      this.isLoading = false;
    }
  });
}
loadMilestones() {
    if (!this.selectedChild) return;
    this.milestoneService.getmilestonesByChild(this.selectedChild).subscribe({
      next: (data) => (this.milestones = data),
      error: (err) => console.error('Error loading milestones:', err)
    });
  }
  calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

newMilestone: Milestone = {
    childId: 0,
    title: '',
    description: '',
    milestoneType: 'PHYSICAL',
    expectedAgeMonths: 0,
    actualDate: '',
    status: 'PENDING'
  };

showAddMilestoneForm = false;
showAddVaccineForm = false;

openAddMilestoneForm() { this.showAddMilestoneForm = true; }
closeAddMilestoneForm() { this.showAddMilestoneForm = false; }

openAddVaccineForm() { this.showAddVaccineForm = true; }
//   if (!this.selectedChild || this.selectedChild <= 0) {
//     console.error('No child selected');
//     return;
//   }
//   const record: GrowthRecord = {
//     ...this.newMilestone,
//     type: this.newMilestone.type as 'PHYSICAL' | 'EMOTIONAL' | 'COGNITION',
//   status: this.newMilestone.status as 'ACHIEVED' | 'NOT_ACHIEVED',
//   height: this.newMilestone.height ?? undefined,
//   weight: this.newMilestone.weight ?? undefined,
//   childId: this.selectedChild

//   };

//   this.growthService.addGrowthRecord(this.selectedChild, record).subscribe({
//     next: () => {
//       this.loadGrowthRecords();
//       this.closeAddMilestoneForm();
//     },
//    error: err => {
//   console.error('Failed to add milestone:', err);
//   console.error('Full error:', JSON.stringify(err, null, 2));
// }
//   });
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
submitMilestone(): void {
    if (!this.selectedChild || this.selectedChild <= 0) {
      console.error('No child selected');
      return;
    }

    const record: Milestone = {
      ...this.newMilestone,
      childId: this.selectedChild
    };

    this.milestoneService.createMilestone(record).subscribe({
      next: () => {
        this.loadMilestones();
        this.closeAddMilestoneForm(); // close modal
        console.log('Milestone added successfully');
      },
      error: (err) => {
        console.error('Failed to add milestone:', err);
        console.error('Full error:', JSON.stringify(err, null, 2));
      }
    });
  }

  completeMilestone(m: Milestone) {
    this.milestoneService.markAsCompleted(m.id!, new Date().toISOString().split('T')[0]).subscribe({
      next: () => this.loadMilestones(),
      error: (err) => console.error('Error completing milestone:', err)
    });
  }

  deleteMilestone(id: number) {
    this.milestoneService.deleteMilestone(id).subscribe({
      next: () => this.loadMilestones(),
      error: (err) => console.error('Error deleting milestone:', err)
    });
  }
onChildChange(newChildId: number): void {
  this.selectedChild = newChildId;
  this.loadGrowthRecords(); 
  this.loadVaccines(); 
  this.loadMilestones();
}

}
