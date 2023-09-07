import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile-component',
  templateUrl: './user-profile-component.component.html',
  styleUrls: ['./user-profile-component.component.scss']
})
export class UserProfileComponentComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] =[];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.userData.Birthday = formatDate(this.user.Birthday, 'mm-dd-yyyy', 'en-US', 'UTC+4');

      this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter((m: { _id: any}) => this.user.FavoriteMovies.indexOf(m._id) >= 0)
      })
    })
  }

  editUser(): void {
    // Assuming you have implemented an appropriate API endpoint and service method for editing the user's profile
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      this.snackBar.open('Your profile has been updated!', 'OK', {
        duration: 2000
      });
      // Optionally, you can refresh the user data here
      this.getUser();
    }, (error) => {
      this.snackBar.open('Error updating profile: ' + error, 'OK', {
        duration: 2000
      });
    });
  }

  //Delete a user's account method
  deleteUser(): void {
    if(confirm('Are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account', 'OK', {
            duration: 2000
          }
        )
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }

  //Delete a movie from favoriteMovies array method
  deleteFavoriteMovie(movieId: string): void {
    if (confirm('Are you sure you want to remove this movie from your favorites?')) {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe(() => {
        this.snackBar.open('Movie removed from favorites!', 'OK', {
          duration: 2000
        });
        // Refresh the list of favorite movies after removal
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieId);
      }, (error) => {
        this.snackBar.open('Error removing movie from favorites: ' + error, 'OK', {
          duration: 2000
        });
      });
    }
  }
}

