import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-component',
  templateUrl: './navigation-component.component.html',
  styleUrls: ['./navigation-component.component.scss']
})

/**
 * This class NavigationComponentComponent is responsible for 
 * routing to the movies, profile, and welcome screens
 */
export class NavigationComponentComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {}

  toMovies(): void {
    this.router.navigate(['movies'])
  }

  toProfile(): void {
    this.router.navigate(['profile'])
  }

  toLogout(): void {
    this.router.navigate(['welcome'])
  }
}
