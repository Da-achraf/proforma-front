import { Component, effect, output, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, debounceTime, of, skip, switchMap, tap } from "rxjs";

@Component({
    selector: 'ba-search-bar',
    templateUrl: './search-bar.component.html',
  })
  export class SearchBarComponent {
    
    search = output<string>();
    
    protected searchValue = '';
    private searchSubject = new BehaviorSubject<string>('');
    protected isLoading = signal(false);

    searchSig = toSignal(this.searchSubject.pipe(
      skip(1),
      tap(value => value?.length >= 0 ? this.isLoading.set(true): null),
      debounceTime(1300),
      tap(() => this.isLoading.set(false)),
      switchMap(value => of(value)),
    ));
  

    private readonly searchSigEffect = effect(() => {
      const searchSig = this.searchSig()
      this.search.emit(searchSig ?? '')
    });
  
    protected onChange(){
      this.searchSubject.next(this.searchValue);
    }
  }