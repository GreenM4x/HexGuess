import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, map, lastValueFrom } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from 'firebase/app';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	user$: Observable<User>;

	constructor(
		private angularAuthService: AngularFireAuth,
		private firestore: AngularFirestore,
		private router: Router
	) {
		this.user$ = angularAuthService.authState;
	}

	isLoggedIn(): Observable<boolean> {
		return this.user$.pipe(map(user => user !== null));
	}

	public async logout() {
		return this.angularAuthService
			.signOut()
			.then(() => this.router.navigate(['/auth']))
			.catch(err => {
				return Promise.reject(this.getErrorMessage(err));
			});
	}

	public async signUpWithEmail(
		email: string,
		password: string,
		username: string
	) {
		const userNameExists = await this.checkUsernameExists(username);
		if (userNameExists) {
			return Promise.reject('Username already taken');
		} else {
			const user = await this.angularAuthService
				.createUserWithEmailAndPassword(email, password)
				.catch((err: FirebaseError) => {
					return Promise.reject(this.getErrorMessage(err));
				});
			return this.createPlayerAndUsername(user, username).catch(
				(err: FirebaseError) => {
					return Promise.reject(this.getErrorMessage(err));
				}
			);
		}
	}

	public async signInWithEmail(email: string, password: string) {
		return this.angularAuthService
			.signInWithEmailAndPassword(email, password)
			.catch(err => {
				return Promise.reject(this.getErrorMessage(err));
			});
	}

	public async signInWithGoogle() {
		const userAuth = await this.angularAuthService
			.signInWithPopup(new GoogleAuthProvider().addScope('profile'))
			.catch((err: FirebaseError) => {
				return Promise.reject(this.getErrorMessage(err));
			});
		if (userAuth.user.displayName && userAuth.additionalUserInfo?.isNewUser) {
			await this.initPlayer(userAuth).catch((err: FirebaseError) => {
				return Promise.reject(this.getErrorMessage(err));
			});
		}
		return userAuth;
	}

	public async signInWithGitHub() {
		const userAuth = await this.angularAuthService
			.signInWithPopup(new GithubAuthProvider())
			.catch((err: FirebaseError) => {
				return Promise.reject(this.getErrorMessage(err));
			});
		if (userAuth.user.displayName && userAuth.additionalUserInfo?.isNewUser) {
			await this.initPlayer(userAuth).catch((err: FirebaseError) => {
				return Promise.reject(this.getErrorMessage(err));
			});
		}
		return userAuth;
	}

	private async initPlayer(userAuth: firebase.default.auth.UserCredential) {
		const displayName = userAuth.user.displayName.replaceAll(' ', '_');
		const userNameExists = await this.checkUsernameExists(displayName);
		if (!userNameExists) {
			return this.createPlayerAndUsername(userAuth, displayName).catch(
				(err: FirebaseError) => {
					return Promise.reject(this.getErrorMessage(err));
				}
			);
		} else {
			return Promise.reject(
				'Username already taken. Try another sign in method.'
			);
		}
	}

	private checkUsernameExists(username: string): Promise<boolean> {
		return lastValueFrom(
			this.firestore
				.collection('usernames')
				.doc(username.toLowerCase())
				.get()
				.pipe(
					map(docSnapshot => {
						return docSnapshot.exists;
					})
				)
		);
	}

	private async createPlayerAndUsername(
		result: firebase.default.auth.UserCredential,
		username: string
	) {
		return Promise.all([
			this.firestore.collection('players').doc(result.user.uid).set({
				username: username,
			}),
			this.firestore.collection('usernames').doc(username.toLowerCase()).set({
				userId: result.user.uid,
			}),
		]);
	}

	private getErrorMessage(err: FirebaseError) {
		// remove "Firebase: " from error message and everything like "(auth/invalid-email)."
		const regex = /(?:Firebase|FirebaseError):? (.+?)(?: \(.+\))?\.?$/;
		const matches = regex.exec(err.message);
		if (matches && matches.length > 1) {
			return matches[1].trim();
		} else {
			return err?.message || 'Unknown error';
		}
	}
}
