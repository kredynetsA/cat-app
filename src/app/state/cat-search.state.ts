import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { Breed, CatImage } from './cat.interface';

export class GetBreeds {
  static readonly type = '[Cat] Get Breeds';
}

export class SearchCats {
  static readonly type = '[Cat] Search Cats';
  constructor(public breed: string, public limit: number) {}
}

export interface CatStateModel {
  breeds: Breed[];
  cats: CatImage[];
  loading: boolean;
}

@State<CatStateModel>({
  name: 'cats',
  defaults: {
    breeds: [],
    cats: [],
    loading: false
  }
})
@Injectable()
export class CatSearchState {
  constructor(private http: HttpClient) {}

  @Selector()
  static breeds(state: CatStateModel) {
    return state.breeds;
  }

  @Selector()
  static cats(state: CatStateModel) {
    return state.cats;
  }

  @Selector()
  static loading(state: CatStateModel) {
    return state.loading;
  }

  @Action(GetBreeds)
  getBreeds(ctx: StateContext<CatStateModel>) {
    ctx.patchState({ loading: true });
    return this.http.get<Breed[]>('https://api.thecatapi.com/v1/breeds').pipe(
      tap((breeds: Breed[]) => {
        ctx.patchState({ breeds, loading: false });
      })
    );
  }

  @Action(SearchCats)
  searchCats(ctx: StateContext<CatStateModel>, action: SearchCats) {
    ctx.patchState({ loading: true });
    const { breed, limit } = action;
    const params = {
      breed_id: breed || '',
      limit: limit.toString()
    };
    return this.http
      .get<CatImage[]>('https://api.thecatapi.com/v1/images/search', {
        params,
        headers: { 'x-api-key': environment.catApiKey }
      })
      .pipe(
        tap((cats: CatImage[]) => {
          ctx.patchState({ cats, loading: false });
        })
      );
  }
}
