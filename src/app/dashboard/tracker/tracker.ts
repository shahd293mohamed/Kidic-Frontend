import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MainService } from '../../Core/services/main_service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GrowthRecordService } from '../../Core/services/growth-record-service';
import { GrowthRecord } from '../../Core/model';
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
export class Tracker implements AfterViewInit, OnInit  {
   children: any[] = [];
    isLoading: boolean = true;
    errorMessage: string = '';
    selectedChild: number = 0;
    growthRecords: GrowthRecord[] = [];

    newChild = {
    name: '',
    gender: true,
    dateOfBirth: '',
    medicalNotes: ''
  };
heightPercentile: number | null = null;
weightPercentile: number | null = null;

  constructor(private renderer: Renderer2, private el: ElementRef, private mainService: MainService, private growthService: GrowthRecordService) {}
  ngOnInit(): void {
    this.loadFamilyData();
    this.loadGrowthRecords();
     
  }
  //  loadGrowthRecords(): void {
  //   this.growthService.getGrowthRecordsByChild(this.selectedChild).subscribe(records => {
  //     this.growthRecords = records;
  //     console.log('Growth Records:', records);
  //   });
  // }
latestHeight: number | undefined;
latestWeight: number | undefined;
lastUpdatedHeight: string = '';
lastUpdatedWeight: string = '';




  // calculatePercentiles(age: number) {
  //   const heightRef = referenceHeights[age];
  //   const weightRef = referenceWeights[age];

  //   this.heightPercentile = this.latestHeight ?? 0;
  //   this.weightPercentile = this.latestWeight ?? 0;

  //   console.log('Height Percentile:', this.heightPercentile);
  //   console.log('Weight Percentile:', this.weightPercentile);
  // }

  calculateHeightPercentile(age: number, height: number): number | null {
  const ref = referenceHeights[age];
  if (!ref) return null; // No reference data for this age

  if (height < ref.P3) return 3;
  if (height < ref.P50) return 50;
  return 97;
}
calculateWeightPercentile(age: number, weight: number): number | null {
  const ref = referenceWeights[age];
  if (!ref) return null; // No reference data for this age

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

    // console.log('Latest Height:', this.latestHeight);
    // console.log('Latest Weight:', this.latestWeight);

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




// loadGrowthRecords(): void {
//   this.growthService.getGrowthRecordsByChild(this.selectedChild).subscribe(records => {
//     this.growthRecords = records;

//     const sorted = [...records].sort((a, b) =>
//       new Date(b.dateOfRecord).getTime() - new Date(a.dateOfRecord).getTime()
//     );

//     const latestHeightRecord = sorted.find(r => r.height != null);
//     const latestWeightRecord = sorted.find(r => r.weight != null);

//     this.latestHeight = latestHeightRecord?.height;
//     this.lastUpdatedHeight = latestHeightRecord?.dateOfRecord || '';

//     this.latestWeight = latestWeightRecord?.weight;
//     this.lastUpdatedWeight = latestWeightRecord?.dateOfRecord || '';
//   });
// }

// loadGrowthRecords(): void {
//   this.growthService.getGrowthRecordsByChild(this.selectedChild).subscribe(records => {
//     this.growthRecords = records;

//     const sorted = [...records].sort((a, b) =>
//       new Date(b.dateOfRecord).getTime() - new Date(a.dateOfRecord).getTime()
//     );

//     const latestHeightRecord = sorted.find(r => r.height != null);
//     const latestWeightRecord = sorted.find(r => r.weight != null);

//     this.latestHeight = latestHeightRecord?.height;
//     this.lastUpdatedHeight = latestHeightRecord?.dateOfRecord || '';

//     this.latestWeight = latestWeightRecord?.weight;
//     this.lastUpdatedWeight = latestWeightRecord?.dateOfRecord || '';

//     // ✅ Get the selected child's age
//     const selectedChildObj = this.children.find(c => c.id === this.selectedChild);
//     const age = selectedChildObj ? selectedChildObj.age : 0;

//     // ✅ Calculate dynamic percentiles
//     this.heightPercentile = this.latestHeight
//       ? this.calculateHeightPercentile(age, this.latestHeight)
//       : null;

//     this.weightPercentile = this.latestWeight
//       ? this.calculateWeightPercentile(age, this.latestWeight)
//       : null;

//     console.log('Height Percentile:', this.heightPercentile);
//     console.log('Weight Percentile:', this.weightPercentile);
//   });
// }


    onAddMilestone(): void {
    const newRecord: GrowthRecord = {
      dateOfRecord: new Date().toISOString().split('T')[0],
      type: 'PHYSICAL',
      status: 'ACHIEVED',
      additionalInfo: 'Started walking',
      height: 80,
      weight: 10,
      childId: this.selectedChild
    };

this.growthService.addGrowthRecord(this.selectedChild, newRecord).subscribe({
  next: response => {
    console.log('Milestone added:', response);
    this.loadGrowthRecords();
  },
  error: err => {
    console.error('Failed to add milestone:', err);

  }
});

  }

  // loadFamilyData() {
  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   this.mainService.getFamily().subscribe({
  //     next: (familyData) => {
  //       console.log("Family Data:", familyData);

  //       this.children = (familyData.children || []).map((child: any) => ({
  //         ...child,
  //         age: this.calculateAge(child.dateOfBirth)
  //       }));

  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error("Error fetching family data:", err);
  //       this.errorMessage = 'Failed to load family information.';
  //       this.isLoading = false;
  //     }
  //   });
  // }
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
  //   calculateAge(dateOfBirth: string): number {
  //   const birthDate = new Date(dateOfBirth);
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();

  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age;
  // }
  calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust if the birthday hasn't happened yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

  ngAfterViewInit(): void {
  const tabTriggers = this.el.nativeElement.querySelectorAll('.tab-trigger');
  const tabContents = this.el.nativeElement.querySelectorAll('.tab-content');

  tabTriggers.forEach((trigger: HTMLElement) => {
    this.renderer.listen(trigger, 'click', () => {
      const targetTab = trigger.getAttribute('data-tab');

      if (!targetTab) return;

      // Remove 'active' class from all tabs and contents
      tabTriggers.forEach((t: HTMLElement) => t.classList.remove('active'));
      tabContents.forEach((c: HTMLElement) => c.classList.remove('active'));

      // Add 'active' to clicked button
      trigger.classList.add('active');

      // Find the matching content and activate it
      const targetContent = this.el.nativeElement.querySelector(`#${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      } else {
        console.error(`No content found for tab: ${targetTab}`);
      }
    });
  });
}


showAddMilestoneForm = false;

newMilestone = {
  additionalInfo: '',
  dateOfRecord: '',
  type: 'PHYSICAL',
  status: 'ACHIEVED',
  height: null,
  weight: null
};

openAddMilestoneForm(): void {
  this.showAddMilestoneForm = true;
}

closeAddMilestoneForm(): void {
  this.showAddMilestoneForm = false;
}

submitMilestone(): void {
  if (!this.selectedChild || this.selectedChild <= 0) {
    console.error('No child selected');
    return;
  }
  const record: GrowthRecord = {
    ...this.newMilestone,
    type: this.newMilestone.type as 'PHYSICAL' | 'EMOTIONAL' | 'COGNITION',
  status: this.newMilestone.status as 'ACHIEVED' | 'NOT_ACHIEVED',
  height: this.newMilestone.height ?? undefined,
  weight: this.newMilestone.weight ?? undefined,
  childId: this.selectedChild

  };

  this.growthService.addGrowthRecord(this.selectedChild, record).subscribe({
    next: () => {
      this.loadGrowthRecords();
      this.closeAddMilestoneForm();
    },
   error: err => {
  console.error('Failed to add milestone:', err);
  console.error('Full error:', JSON.stringify(err, null, 2));
}
  });
}
onChildChange(newChildId: number): void {
  this.selectedChild = newChildId;
  this.loadGrowthRecords(); // Load new child's growth data
}

}
