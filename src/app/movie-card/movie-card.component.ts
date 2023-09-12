import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MovieInfoComponentComponent } from '../movie-info-component/movie-info-component.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

/**
 * MovieCardComponent is responsible for displaying the movie cards 
 * that have the ability to use the data that is retrieved from movie component
 */
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Get the full array of movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Retrieves the name and description of the movie genre
   * @param name 
   * @param description 
   */
  getGenre(name: string, description: string): void {
    this.dialog.open(MovieInfoComponentComponent, {
      data: { title: name, content: description,}
    })
  }

  /**
   * Retrieves the name and bio of the movie director
   * @param name 
   * @param bio 
   */
  getOneDirector(name: string, bio: string): void {
    this.dialog.open(MovieInfoComponentComponent, {
      data: {title: name, content: bio, }
    })
  }

  /**
   * Retrieves the movie description
   * @param description 
   */
  getSynopsis(description: string): void {
    this.dialog.open(MovieInfoComponentComponent, {
      data: { title: 'Description', content: description, }
    })
  }

  /**
   * Using the movie id to add to favorite movies 
   * @param _id 
   */
  addFavorite(_id: string): void {
    console.log(_id, 'the movie ID')
    this.fetchApiData.addFavoriteMovie(_id).subscribe((Response: any) => {
      this.snackBar.open('Movie was added to favorites', 'OK', {
        duration: 2000
      })
    })
  }

  /**
   * If the movie is a favorite movie
   * @param _id 
   * @returns the movie_id to the favorite movies array
   */
  isFavorite(_id: string): Observable<boolean> {
    return this.fetchApiData.isFavoriteMovie(_id);
  }

  /**
   * Removes a favorite movie_id from the favorite movies array
   * @param _id 
   */
  removeFavorite(_id: string): void {
    this.fetchApiData.deleteFavoriteMovie(_id).subscribe((Response: any) => {
      this.snackBar.open('Removed from favorite movies', 'OK', {
        duration: 2000
      })
    })
  }

}