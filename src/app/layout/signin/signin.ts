import { Component, OnInit } from '@angular/core';
import { Auth } from '../../Core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { Ilogin } from '../../Core/model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'signin',
  imports: [ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin implements OnInit{
  constructor(private _auth:Auth, private _router:Router) { }
  ngOnInit(): void {
      this._auth.initAuth();
    
  }

  loginForm : FormGroup = new FormGroup({
    email : new FormControl<string|null>('',[Validators.required,Validators.email]),
    password : new FormControl<string|null>('',[Validators.required]),
  })
  msg = '';
  submit(){
    const Value = this.loginForm.value as Ilogin;
     this._auth.login(Value).subscribe({
    next: res => {
      this.msg = "✅ Logged in successfully!";
      console.log("Login Success:", res);}
    ,
    error: err => {
      this.msg = "❌ email or password is incorrect";
      console.error("Login Failed:", err);
    }
    
  })
  console.log(Value);
  
  }


}

