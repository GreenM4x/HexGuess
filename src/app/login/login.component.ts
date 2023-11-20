import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
	AngularFireAuth,
	AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, AngularFireAuthModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	constructor(
		private angularAuthService: AngularFireAuth,
		private formBuilder: FormBuilder,
		private router: Router
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.loginForm.valid) {
			this.angularAuthService
				.signInWithEmailAndPassword(
					this.loginForm.get('username').value,
					this.loginForm.get('password').value
				)
				.then(() => this.router.navigate(['']))
				.catch(err => {
					console.log(err);
				});
			console.log('Form submitted with values:', this.loginForm.value);
		}
	}

	signInWithEmail() {
		// Add logic for signing in with email
		console.log('Signing in with email...');
	}

	signInWithGoogle() {
		this.angularAuthService.signInWithPopup(new GoogleAuthProvider()).then(
			() => {
				this.router.navigate(['']);
			},
			err => {
				alert(err.message);
			}
		);
	}
}
