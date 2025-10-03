import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
  imports: [FormsModule, CommonModule],
  templateUrl: './tracker.html',
  styleUrls: ['./tracker.css']
})
export class Tracker implements OnInit {
  activeTab: string = 'milestones';
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

  latestHeight: number | undefined;
  latestWeight: number | undefined;
  lastUpdatedHeight: string = '';
  lastUpdatedWeight: string = '';

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

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private mainService: MainService,
    private growthService: GrowthRecordService,
    private vaccineService: VaccineService,
    private milestoneService: MilestonesService
  ) {}

  ngOnInit(): void {
    // only load family here — other data depends on selectedChild which is set after family loads
    this.loadFamilyData();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  loadVaccines(): void {
    if (!this.selectedChild || this.selectedChild <= 0) {
      this.vaccines = [];
      return;
    }
    this.vaccineService.getVaccinesByChild(this.selectedChild).subscribe({
      next: (data) => {
        this.vaccines = data;
        console.log('Vaccines loaded for child', this.selectedChild, data);
      },
      error: (err) => console.error('Error loading vaccines', err)
    });
  }

  recordVaccine(): void {
    if (!this.selectedChild || this.selectedChild <= 0) {
      console.error('No child selected for vaccine record');
      return;
    }
    if (this.editingVaccine) {
      this.vaccineService.updateVaccine(this.editingVaccine.id, this.newVaccine).subscribe({
        next: () => {
          this.loadVaccines();
          this.cancelEdit();
          this.closeAddVaccineForm();
        },
        error: (err) => console.error('Error updating vaccine', err)
      });
    } else {
      this.vaccineService.addVaccine(this.selectedChild, this.newVaccine).subscribe({
        next: () => {
          this.loadVaccines();
          this.newVaccine = { name: '', status: 'due', date: '' };
          this.closeAddVaccineForm();
        },
        error: (err) => console.error('Error adding vaccine', err)
      });
    }
  }

  editVaccine(vaccine: any): void {
    this.editingVaccine = vaccine;
    this.newVaccine = { ...vaccine };
    this.openAddVaccineForm();
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

  calculateHeightPercentile(ageYears: number, height: number): number | null {
    const ref = referenceHeights[ageYears];
    if (!ref) return null;

    if (height < ref.P3) return 3;
    if (height < ref.P50) return 50;
    return 97;
  }

  calculateWeightPercentile(ageYears: number, weight: number): number | null {
    const ref = referenceWeights[ageYears];
    if (!ref) return null;

    if (weight < ref.P3) return 3;
    if (weight < ref.P50) return 50;
    return 97;
  }

  loadGrowthRecords(): void {
    if (!this.selectedChild || this.selectedChild <= 0) {
      this.growthRecords = [];
      this.latestHeight = undefined;
      this.latestWeight = undefined;
      this.heightPercentile = null;
      this.weightPercentile = null;
      return;
    }

    this.growthService.getGrowthRecordsByChild(this.selectedChild).subscribe({
      next: (records) => {
        console.log('Growth Records:', records);
        this.growthRecords = records || [];

        const sorted = [...this.growthRecords].sort((a, b) =>
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
        const ageYears = selectedChildObj?.dateOfBirth
          ? this.calculateAge(selectedChildObj.dateOfBirth)
          : 0;

        console.log('Selected Child:', selectedChildObj);
        console.log('Age (years):', ageYears);

        this.heightPercentile = this.latestHeight != null
          ? this.calculateHeightPercentile(ageYears, this.latestHeight)
          : null;

        this.weightPercentile = this.latestWeight != null
          ? this.calculateWeightPercentile(ageYears, this.latestWeight)
          : null;

        console.log('Height Percentile:', this.heightPercentile);
        console.log('Weight Percentile:', this.weightPercentile);
      },
      error: (err) => {
        console.error('Error loading growth records:', err);
      }
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

        if (this.children.length > 0) {
          this.selectedChild = this.children[0].id;
          this.loadGrowthRecords();
          this.loadVaccines();
          this.loadMilestones();
        } else {
          // nothing to load
          this.selectedChild = 0;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching family data:', err);
        this.errorMessage = 'Failed to load family information.';
        this.isLoading = false;
      }
    });
  }

  loadMilestones() {
    if (!this.selectedChild || this.selectedChild <= 0) return;
    this.milestoneService.getmilestonesByChild(this.selectedChild).subscribe({
      next: (data) => {
        this.milestones = data || [];
        console.log('Milestones loaded:', this.milestones);
      },
      error: (err) => console.error('Error loading milestones:', err)
    });
  }

  /**
   * Calculate age in YEARS (integer). Use this value when looking up reference tables.
   * If you need a string for display (e.g. "2 years 3 months"), create a separate formatter.
   */
  calculateAge(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }
    return Math.max(0, years);
  }

  getAge(dateOfBirth: string): string {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const diff = today.getTime() - birthDate.getTime();
  const ageDate = new Date(diff);
  const years = ageDate.getUTCFullYear() - 1970;
  const months = ageDate.getUTCMonth();
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  return `${months} month${months > 1 ? 's' : ''}`;
  }


  openAddMilestoneForm() { this.showAddMilestoneForm = true; }
  closeAddMilestoneForm() { this.showAddMilestoneForm = false; }
  openAddVaccineForm() { this.showAddVaccineForm = true; }

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
        this.closeAddMilestoneForm();
        console.log('Milestone added successfully');
      },
      error: (err) => {
        console.error('Failed to add milestone:', err);
        console.error('Full error:', JSON.stringify(err, null, 2));
      }
    });
  }

  completeMilestone(m: Milestone) {
    if (!m.id) {
      console.error('Milestone id missing');
      return;
    }
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
