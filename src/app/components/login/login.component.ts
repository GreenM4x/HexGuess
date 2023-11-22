import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '@core/services/firebase.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	constructor(
		private formBuilder: FormBuilder,
		private fbService: FirebaseService
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	onSubmit() {
		if (this.loginForm.valid) {
			this.signInWithEmail();

		}
	}

	signInWithEmail() {
		this.fbService.signInWithEmail(this.loginForm.get('username').value, this.loginForm.get('password').value)
		console.log('Signing in with email...');
	}

	signInWithGoogle() {
		this.fbService.signInWithGoogle();
	}

	signInWithGitHub() {
		this.fbService.signInWithGitHub();
	}
}
