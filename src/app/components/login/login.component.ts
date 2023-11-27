import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '@core/services/firebase.service';
import { matchingInputsValidator } from '@shared/validators/matching.validator';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { UsernameValidator } from '../../shared/validators/username.validator';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	isRegistered: boolean = true;
	loginForm!: FormGroup;
	isLoadingSignIn: boolean = false;
	isLoadingGoogle: boolean = false;
	isLoadingGitHub: boolean = false;

	public get isValidForm() {
		if (this.isRegistered) {
			return (
				this.loginForm.get('email').valid &&
				this.loginForm.get('password').valid
			);
		} else {
			return this.loginForm.valid;
		}
	}

	constructor(
		private formBuilder: FormBuilder,
		private fbService: FirebaseService,
		private router: Router
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group(
			{
				username: [
					'',
					[
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(20),
						UsernameValidator(),
					],
				],
				email: ['', [Validators.required]],
				password: ['', [Validators.required]],
				repeatPassword: ['', [Validators.required]],
			},
			{
				validators: matchingInputsValidator('password', 'repeatPassword'),
			}
		);
	}

	toggleToRegister() {
		this.isRegistered = !this.isRegistered;
		this.loginForm.reset();
	}

	public async onSubmit() {
		this.isLoadingSignIn = true;
		if (this.isValidForm && this.isRegistered) {
			await this.signInWithEmail();
		} else if (this.isValidForm && !this.isRegistered) {
			await this.signUpWithEmail();
		}
		this.isLoadingSignIn = false;
		this.router.navigate(['']);
	}

	public async signInWithEmail() {
		return this.fbService
			.signInWithEmail(
				this.loginForm.get('email').value,
				this.loginForm.get('password').value
			)
			.catch((err: string) => {
				this.loginForm.setErrors({ firebase: err });
			});
	}

	public async signUpWithEmail() {
		return this.fbService
			.signUpWithEmail(
				this.loginForm.get('email').value,
				this.loginForm.get('password').value,
				this.loginForm.get('username').value
			)
			.catch((err: string) => {
				this.loginForm.setErrors({ firebase: err });
			});
	}

	public async signInWithGoogle() {
		this.isLoadingGoogle = true;
		await this.fbService.signInWithGoogle().catch((err: string) => {
			this.loginForm.setErrors({ firebase: err });
		});
		this.isLoadingGoogle = false;
		this.router.navigate(['']);
	}

	public async signInWithGitHub() {
		this.isLoadingGitHub = true;
		await this.fbService.signInWithGitHub().catch((err: string) => {
			this.loginForm.setErrors({ firebase: err });
		});
		this.isLoadingGitHub = false;
		this.router.navigate(['']);
	}
}
