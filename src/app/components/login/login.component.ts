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
	isRegistered: boolean = true;
	loginForm!: FormGroup;
	public pwError: string = 'Password is reguired.';

	constructor(
		private formBuilder: FormBuilder,
		private fbService: FirebaseService
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			repeatPassword: [''],
		});
		// Set the validation conditionally based on isRegistered value
		this.loginForm
			.get('repeatPassword')
			.setValidators(this.isRegistered ? null : Validators.required);

		// Update the form status after changing validators
		this.loginForm.get('repeatPassword').updateValueAndValidity();
	}

	toggleToRegister() {
		this.isRegistered = !this.isRegistered;
		console.log(this.isRegistered);

		this.loginForm
			.get('repeatPassword')
			.setValidators(this.isRegistered ? null : Validators.required);
		this.loginForm.get('repeatPassword').updateValueAndValidity();
	}

	onSubmit() {
		if (this.loginForm.valid && this.isRegistered) {
			this.signInWithEmail();
		} else if (this.loginForm.valid && !this.isRegistered) {
			this.signUpWithEmail();
		}
	}

	signInWithEmail() {
		this.fbService.signInWithEmail(
			this.loginForm.get('username').value,
			this.loginForm.get('password').value
		);
		console.log('Signing in with email...');
	}

	signUpWithEmail() {
		if (
			this.loginForm.get('password').value ===
			this.loginForm.get('repeatPassword').value
		) {
			this.fbService.signUpWithEmail(
				this.loginForm.get('username').value,
				this.loginForm.get('password').value
			);
			console.log('Signing up with email...');
		} else {
			this.pwError = 'Password not match.';
			this.loginForm.get('repeatPassword').touched;
			this.loginForm.get('repeatPassword').hasError('required');
		}
	}

	signInWithGoogle() {
		this.fbService.signInWithGoogle();
	}

	signInWithGitHub() {
		this.fbService.signInWithGitHub();
	}
}
