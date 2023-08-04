import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// This import brings in the API calls
import { FetchApiDataService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

//Components to wire up with the stylesheet and template
@Component({
    selector: 'app-user-login-form',//Will render here
    templateUrl: './user-login-form.component.html',
    styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {
    //Input decorators that will take userData and pass it on to the API
    @Input() userData = { Username: '', Password: '', };

    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserLoginFormComponent>,
        public snackBar: MatSnackBar,
        private router: Router,
        ) { }

    ngOnInit(): void {
    }

    //This function is responsible for sending the form data to the backend
    loginUser(): void {
        this.fetchApiData.userLogin(this.userData).subscribe((data) => {
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)
            localStorage.setItem('Username', data.user.Username)
            this.router.navigate(['movies'])
            this.dialogRef.close();
            this.snackBar.open('You are now logged in', 'OK', {
                duration: 2000
            });
        }, () => {
            this.snackBar.open('Something went wrong', 'OK', {
                duration: 2000
            })
        })
    }
}