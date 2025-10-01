// import { Component, OnInit } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { Auth } from '../../Core/services/auth';

// @Component({
//   selector: 'app-signup',
//   imports: [RouterLink],
//   templateUrl: './signup.html',
//   styleUrl: './signup.css'
// })
// export class Signup implements  OnInit{
//   constructor(private _router:Router, private _auth:Auth) { }
//   ngOnInit(): void {
//     this._auth.signup({}).subscribe(res=>{console.log(res)});
//   }


// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../Core/services/auth'; // adjust path to your service
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [RouterLink, ReactiveFormsModule,CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
// export class Signup implements OnInit {
//   signupForm!: FormGroup;
//   isJoinFamily = false; // toggle family code visibility
//   loading = false;
//   errorMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private auth: Auth,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.signupForm = this.fb.group({
//       first_name: ['', Validators.required],
//       last_name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirm_password: ['', Validators.required],
//       gender: [true, Validators.required], // true = Male, false = Female
//       account_type: ['new_family', Validators.required],
//       familyId: [''] // optional, only required if joining
//     });
//   }

//   // Toggle visibility of family code input
//   onAccountTypeChange(type: string) {
//     this.isJoinFamily = type === 'join_family';

//     if (this.isJoinFamily) {
//       this.signupForm.get('familyId')?.setValidators([Validators.required]);
//     } else {
//       this.signupForm.get('familyId')?.clearValidators();
//     }
//     this.signupForm.get('familyId')?.updateValueAndValidity();
//   }

//   // Submit form
//   onSubmit(): void {
//     if (this.signupForm.invalid) {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       return;
//     }

//     const formValues = this.signupForm.value;

//     // Combine first and last name for backend
//     const fullName = `${formValues.first_name} ${formValues.last_name}`;

//     // Prepare request data for backend
//     const signupData: any = {
//       name: fullName,
//       phone: formValues.phone,
//       email: formValues.email,
//       gender: formValues.gender, // true = Male, false = Female
//       password: formValues.password
//     };

//     // Include familyId only if joining a family
//     if (this.isJoinFamily) {
//       signupData.familyId = formValues.familyId;
//     }

//     this.loading = true;
//     this.auth.signup(signupData).subscribe({
//       next: (res) => {
//         this.loading = false;
//         console.log('Signup successful:', res);
//         this.router.navigate(['/signin']);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
//         console.error('Signup error:', err);
//       }
//     });
//   }
// }

export class Signup implements OnInit {
  signupForm!: FormGroup;
  isJoinFamily = false; // Toggle family code visibility
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required],
      gender: [true, Validators.required], // true = Male, false = Female
      account_type: ['new_family', Validators.required], // new_family or join_family
      familyId: [''] // Required only if joining
    });
  }

  // Toggle family code input based on account type
  onAccountTypeChange(type: string) {
    this.isJoinFamily = type === 'join_family';

    if (this.isJoinFamily) {
      this.signupForm.get('familyId')?.setValidators([Validators.required]);
    } else {
      this.signupForm.get('familyId')?.clearValidators();
    }
    this.signupForm.get('familyId')?.updateValueAndValidity();
  }

  // Submit form
  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formValues = this.signupForm.value;

    // Combine first and last name for backend
    const fullName = `${formValues.first_name} ${formValues.last_name}`;

    // Prepare request data
    const signupData: any = {
      name: fullName,
      phone: formValues.phone,
      email: formValues.email,
      gender: formValues.gender, // true = Male, false = Female
      password: formValues.password
    };

    this.loading = true;

    // Decide which API to call based on account type
    if (formValues.account_type === 'new_family') {
      // New family signup
      this.auth.signupNewFamily(signupData).subscribe({
        next: (res) => {
          this.loading = false;
          console.log('New family signup successful:', res);
          this.router.navigate(['/signin']); // redirect to login
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
          console.error('New family signup error:', err);
        }
      });
    } else {
      // Joining an existing family
      signupData.familyId = formValues.familyId;

      this.auth.signupExistingFamily(signupData).subscribe({
        next: (res) => {
          this.loading = false;
          console.log('Joined existing family successfully:', res);
          this.router.navigate(['/signin']); // redirect to login
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
          console.error('Join family signup error:', err);
          console.log(signupData);
        }
      });
    }
  }
}
