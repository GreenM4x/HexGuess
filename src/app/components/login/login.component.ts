import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '@core/services/firebase.service';
import { matchingInputsValidator } from '@shared/validators/matching.validator';

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
				playerName: [
					'',
					[
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(20),
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
	}

	public async onSubmit() {
		if (this.isValidForm && this.isRegistered) {
			await this.signInWithEmail();
		} else if (this.isValidForm && !this.isRegistered) {
			await this.signUpWithEmail();
		}
		this.router.navigate(['']);
	}

	public async signInWithEmail() {
		return this.fbService
			.signInWithEmail(
				this.loginForm.get('email').value,
				this.loginForm.get('password').value
			)
			.catch(msg => {
				this.loginForm.setErrors({ firebase: msg });
			});
	}

	public async signUpWithEmail() {
		return this.fbService
			.signUpWithEmail(
				this.loginForm.get('email').value,
				this.loginForm.get('password').value,
				this.loginForm.get('playerName').value
			)
			.catch(err => {
				this.loginForm.setErrors({ firebase: err });
			});
	}

	public async signInWithGoogle() {
		await this.fbService.signInWithGoogle();
		this.router.navigate(['']);
	}

	public async signInWithGitHub() {
		await this.fbService.signInWithGitHub();
		this.router.navigate(['']);
	}
}
