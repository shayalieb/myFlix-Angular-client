import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieInfoComponentComponent } from './movie-info-component.component';

describe('MovieInfoComponentComponent', () => {
  let component: MovieInfoComponentComponent;
  let fixture: ComponentFixture<MovieInfoComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieInfoComponentComponent]
    });
    fixture = TestBed.createComponent(MovieInfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
