import { Component, effect, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, of, skip, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  isSearchloading = signal(false);
  searchTerm = output<string>();

  searchValue = '';

  searchSubject = new BehaviorSubject<string>('');
  searchSig = toSignal(this.searchSubject.pipe(
    skip(1),
    tap(value => value?.length >= 0 ? this.isSearchloading.set(true): null),
    debounceTime(1300),
    tap(() => this.isSearchloading.set(false)),
    switchMap(value => of(value)),
  ));

  constructor(){
    effect(() => {
      const searchSig = this.searchSig()
      this.searchTerm.emit(searchSig ?? '')
    });
  }

  onChange(){
    this.searchSubject.next(this.searchValue);
  }

  clearSearch() {
    this.searchValue = ''
    if (this.searchSubject.value.length != 0) this.searchSubject.next('')
  }
}
