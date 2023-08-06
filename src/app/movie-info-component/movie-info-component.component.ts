import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-info-component',
  templateUrl: './movie-info-component.component.html',
  styleUrls: ['./movie-info-component.component.scss']
})
export class MovieInfoComponentComponent {
  //@inject will add the data form the movie object the movie info dialog
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string, content: string}
  ) { }

  ngOnInit(): void { }
}
