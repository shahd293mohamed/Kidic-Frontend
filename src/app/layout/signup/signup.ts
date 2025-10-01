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
export class Signup implements OnInit {
  signupForm!: FormGroup;
  isJoinFamily = false; 
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
      gender: [true, Validators.required], 
      account_type: ['new_family', Validators.required], 
      familyId: [''] 
    });
  }

  onAccountTypeChange(type: string) {
    this.isJoinFamily = type === 'join_family';

    if (this.isJoinFamily) {
      this.signupForm.get('familyId')?.setValidators([Validators.required]);
    } else {
      this.signupForm.get('familyId')?.clearValidators();
    }
    this.signupForm.get('familyId')?.updateValueAndValidity();
  }
  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formValues = this.signupForm.value;
    const fullName = `${formValues.first_name} ${formValues.last_name}`;
    const signupData: any = {
      name: fullName,
      phone: formValues.phone,
      email: formValues.email,
      gender: formValues.gender, 
      password: formValues.password
    };

    this.loading = true;
    if (formValues.account_type === 'new_family') {
      this.auth.signupNewFamily(signupData).subscribe({
        next: (res) => {
          this.loading = false;
          console.log('New family signup successful:', res);
          this.router.navigate(['/signin']); 
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Signup failed. Please try again.';
          console.error('New family signup error:', err);
        }
      });
    } else {
      signupData.familyId = formValues.familyId;

      this.auth.signupExistingFamily(signupData).subscribe({
        next: (res) => {
          this.loading = false;
          console.log('Joined existing family successfully:', res);
          this.router.navigate(['/signin']); 
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
