
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'

//Declare the API url that will provide data to the 
const apiUrl = 'https://shyflixapp.herokuapp.com/'
// const apiUrl = 'http://localhost:8080/'
@Injectable({ providedIn: 'root' })//This will be avail everywhere

//The class component that will handle the API and Error calls
export class FetchApiDataService {
  constructor(private http: HttpClient) { }

  //TS CODE EXPLANATION
  //The .pipe is the value that takes the expression and return a transformed value
  //The public expression make it accessible anywhere 
  //An Observable takes the collection and filters it down to return the desired value 
  
  //API call for user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  //API call for login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  //API call to get all movies endpoint
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //API call to get a single movie
  getSingleMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError))
  }

  //API call to get director info
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //API call to get genre
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //APi call to get user 
  getOneUser(): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //API call to get favorite movies
  getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), map((data) => data.FavoriteMovies), catchError(this.handleError));
  }

  //API call for adding favorite movies
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    user.FavoriteMovies.push(movieId);
    localStorage.setItem('user', JSON.stringify(user));

    return this.http.post(apiUrl + `users/${user.Username}/movies/${movieId}`, '{}', {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  isFavoriteMovie(movieId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.includes(movieId) >= 0
  }

  //API call for edit user profile
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //API call for deleting a user
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('Username');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //API call for deleting a favorite movie
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    const index = user.FavoriteMovies.indexOf(movieId);
    if(index >= 0) {
      user.FavoriteMovies.splice(index, 1);
    }
    
    localStorage.setItem('user', JSON.stringify(user))
    
    return this.http.delete(apiUrl + `users/${user.Username}/movies/${movieId}`, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Data of any type extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  //Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Error status code ${error.status},` + `Error body is ${error.error}`);
    }
    return throwError(() => new Error('Something happened, please try again later'));
  }
}