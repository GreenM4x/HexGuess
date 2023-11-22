import { Injectable } from '@angular/core';
import {
	AngularFireAuth,
	AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
		private angularAuthService: AngularFireAuth,
		private router: Router
	) {}

  signInWithEmail(username: string, password: string){
    return this.angularAuthService
    .signInWithEmailAndPassword(username,password)
    .then(() => this.router.navigate(['']))
    .catch(err => {
      console.log(err);
    });
  }

  signInWithGoogle() {
    return this.angularAuthService.signInWithPopup(new GoogleAuthProvider()).then(
			() => {
				this.router.navigate(['']);
			},
			err => {
				alert(err.message);
			}
		);
  }


  signInWithGitHub() {
		return this.angularAuthService.signInWithPopup(new GithubAuthProvider()).then(
			() => {
				this.router.navigate(['']);
			},
			err => {
				alert(err.message);
			}
		);
	}
}
