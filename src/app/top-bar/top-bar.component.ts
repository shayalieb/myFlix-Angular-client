import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  //Navigate the all movies
  toMovies(): void {
    this.router.navigate(['movies']);
  }

  //Navigate to user profile
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  //Log out and clear the local storage
  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
