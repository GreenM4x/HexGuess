import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
	GoogleAuthProvider,
	GithubAuthProvider,
	User,
	UserCredential,
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
				return Promise.reject(err.message);
			});
	}

	public async signUpWithEmail(
		username: string,
		password: string,
		playerName: string
	) {
		const userNameExists = await this.checkUsernameExists(playerName);
		if (userNameExists) {
			return Promise.reject('Username already taken');
		} else {
			const user = await this.angularAuthService
				.createUserWithEmailAndPassword(username, password)
				.catch((err: FirebaseError) => {
					return Promise.reject(err.message);
				});
			return this.createPlayerAndUsername(
				user as unknown as UserCredential,
				playerName
			).catch((err: FirebaseError) => {
				return Promise.reject(err.message);
			});
		}
	}

	public async signInWithEmail(username: string, password: string) {
		await this.angularAuthService
			.signInWithEmailAndPassword(username, password)
			.catch(err => {
				return Promise.reject(err.message);
			});
	}

	public async signInWithGoogle() {
		await this.angularAuthService
			.signInWithPopup(new GoogleAuthProvider())
			.catch((err: FirebaseError) => {
				return Promise.reject(err.message);
			});
	}

	public async signInWithGitHub() {
		await this.angularAuthService
			.signInWithPopup(new GithubAuthProvider())
			.catch((err: FirebaseError) => {
				return Promise.reject(err.message);
			});
	}

	private checkUsernameExists(username: string): Promise<boolean> {
		return lastValueFrom(
			this.firestore
				.collection('usernames')
				.doc(username)
				.get()
				.pipe(
					map(docSnapshot => {
						return docSnapshot.exists;
					})
				)
		);
	}

	private async createPlayerAndUsername(
		result: UserCredential,
		playerName: string
	) {
		return Promise.all([
			this.firestore.collection('players').doc(result.user.uid).set({
				playerName: playerName,
			}),
			this.firestore.collection('usernames').doc(playerName).set({
				userId: result.user.uid,
			}),
		]);
	}
}
