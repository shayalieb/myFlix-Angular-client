import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

//Components to wire up with the stylesheet and template
@Component({
  selector: 'app-user-registration-form',//Will render here
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  //Input decorators that will take userData and pass it on to the API
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void{
  }

  //This function is responsible for sending the form data to the backend
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((response) => {
      //If registration was successful, the next line will close the modal
      this.dialogRef.close();
      //console.log(response)
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    }, (response) => {
      //console.log(response)
      this.snackBar.open(response, 'OK', {
        duration: 2000
      })
    })
  }
}