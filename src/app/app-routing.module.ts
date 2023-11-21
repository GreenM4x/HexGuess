import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
	canActivate,
	redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

import { LoginComponent } from './components/login/login.component';
import { GameBoardComponent } from './components/game-board/game-board.component';

const redirectToLogin = () => redirectUnauthorizedTo(['auth']);
const routes: Routes = [
	{ path: 'auth', component: LoginComponent },
	{
		path: '',
		component: GameBoardComponent,
		...canActivate(redirectToLogin),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
