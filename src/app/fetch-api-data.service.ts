
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
  
  /**
   * This function takes the user information and signs up the new user
   * @param userDetails 
   * @returns a new user to the database
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  //API call for login endpoint

  /**
   * 
   * @param userDetails 
   * @returns a logged in user if the information is correct
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  //API call to get all movies endpoint
  /**
   * //API call to get all movies endpoint once logged in all movies will show
   * @returns the list of movies
   */
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

  /**
   * API call to get a single movie
   * @param title 
   * @returns a single movie title
   */
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

  /**
   * API call to get director info
   * @param directorName 
   * @returns the director name 
   */
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

  /**
   * API call to get genre
   * @param genreName 
   * @returns the genre name
   */
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

  /**
   * API call to get one user
   * @returns the user information of one single user
   */
  getOneUser(): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), map((data) => {
      return {
        ...data,
        FavoriteMovies: data.FavoriteMovies
      };
    }), catchError(this.handleError));
  }

  /**
   * API call to get favorite movies
   * @returns the array of the users favorite movies
   */
  getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), map((data) => data.FavoriteMovies), catchError(this.handleError));
  }
  
  /**
   * API call for adding favorite movies
   * @param movieId 
   * @returns adding the movie that was selected to the users favorite movies array
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const user = localStorage.getItem('Username') || '{}';
    const token = localStorage.getItem('token');
  
    return this.http.post(apiUrl + `users/${user}/movies/${movieId}`, '{}', {
      headers: new HttpHeaders(
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * If the movie is a favorite movie
   * @param movieId 
   * @returns the movie to the users favorite movies array
   */
  isFavoriteMovie(movieId: string): Observable<boolean> {
    return this.getFavoriteMovies().pipe(
      map(favoriteMovies => favoriteMovies.includes(movieId))
    );
  }

  /**
   * API call for edit user profile
   * @param updatedUser 
   * @returns an updated user profile with the info th user provided
   */
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('Username');
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, updatedUser, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token
        }
      )
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * API call for deleting a user
   * @returns the user to the welcome page as the user was deleted
   */
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

  /**
   * API call for deleting a favorite movie
   * @param movieId 
   * @returns a deleted move from the users favorite movie array
   */
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
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

  /**
   * Data of any type extraction
   * @param res 
   * @returns the data of any type
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Error handling
   * @param error 
   * @returns the error response
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Error status code ${error.status},` + `Error body is ${error.error}`);
    }
    return throwError(() => new Error('Something happened, please try again later'));
  }
}