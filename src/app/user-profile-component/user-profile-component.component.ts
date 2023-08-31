import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';

// type User = { _id?: string, Username?: string, Password?: string, Email?: string, FavoriteMOvies?: [] }

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
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      this.snackBar.open('Your profile has been updated!', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    })
  }

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
}
// import { Component, Input, OnInit } from '@angular/core'
// import { FetchApiDataService } from '../fetch-api-data.service'
// import { MatSnackBar } from '@angular/material/snack-bar'
// import { Router } from '@angular/router'

// type User = {_id?: string, Username?: string, Password?: string, Email?: string, FavoriteMovies?: [] }

// @Component({
//   selector: 'app-user-profile-component',
//   templateUrl: './user-profile-component.component.html',
//   styleUrls: ['./user-profile-component.component.scss']
// })

// export class UserProfileComponentComponent implements OnInit {
//   user: User = {}

//   @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};

//   constructor(
//     public fetchApiData: FetchApiDataService,
//     public snackBar: MatSnackBar,
//     public router: Router,
//   ) { }

//   ngOnInit(): void {
//     const user = this.getUser();
//     if(!user._id) {
//       this.router.navigate(['welcome']);
//       return;
//     }

//     this.user = user;
//     this.userData = {
//       Username: user.Username || '',
//       Email: user.Email || '',
//       Password: '',
//       Birthday: ''

//     }
//   }

//   getUser(): User {
//     return JSON.parse(localStorage.getItem('user') || '{}');
//   }

//   updateUser(): void {
//     this.fetchApiData.editUser(this.userData).subscribe((result) => {
//       localStorage.setItem('user', JSON.stringify(result))
//       this.user = result;
//       this.snackBar.open('Account updated!', 'OK', {
//         duration: 2000
//       })
//     })
//   }

//   deleteUser(): void {
//         if(confirm('Are you sure?')) {
//           this.router.navigate(['welcome']).then(() => {
//             this.snackBar.open(
//               'You have successfully deleted your account', 'OK', {
//                 duration: 2000
//               }
//             )
//           });
//           this.fetchApiData.deleteUser().subscribe((result) => {
//             console.log(result);
//             localStorage.clear();
//           });
//         }
//       }
// }



