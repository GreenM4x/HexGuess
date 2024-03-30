import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [HeaderComponent, RouterOutlet, HttpClientModule],
})
export class AppComponent {
	title = 'HexGuess';
	constructor(private http: HttpClient) {
		this.http.get<{message: string}>('/api/hello').subscribe((data: { message: string }) => {
			console.log(data);
		});
	}
}
