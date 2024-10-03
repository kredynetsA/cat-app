import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { GetBreeds, SearchCats } from '../../state/cat-search.state';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cat-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './cat-search.component.html',
  styleUrl: './cat-search.component.scss'
})
export class CatSearchComponent {
  catForm!: FormGroup;
  breeds$: any;
  cats$: any;

  constructor(private fb: FormBuilder, private store: Store) {
    this.breeds$ = this.store.select(state => state.cats.breeds);
    this.cats$ = this.store.select(state => state.cats.cats);
  }

  ngOnInit(): void {
    this.catForm = this.fb.group({
      breed: [''],
      limit: [10]
    });

    this.store.dispatch(new GetBreeds());
    this.search();
  }

  search(params?: {breed: any, limit: any}): void {
    const { breed, limit } = params ? params : this.catForm.value;
    const parsedLimit = parseInt(limit, 10);
    const validLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? 10 : parsedLimit;
    this.store.dispatch(new SearchCats(breed, validLimit));
  }
}
