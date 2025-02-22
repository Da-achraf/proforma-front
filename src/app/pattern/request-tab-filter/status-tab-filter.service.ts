import { Injectable, signal } from '@angular/core';
import { delay, of, tap } from 'rxjs';
import { StatusFilterOptions } from './data';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class RequestStatusTabFilterService {
  private _loading = signal(false);
  loading = this._loading.asReadonly();

  /**
   * @description
   * If the implementation of _options changes in the future,
   * we exposes the public signal options so it will be decoupled
   * from the implementation.
   *
   */
  private options$ = of(StatusFilterOptions).pipe(
    tap(() => this._loading.set(true)),
    delay(900),
    tap(() => this._loading.set(false)),
  );

  options = toSignal(this.options$, { initialValue: [] });
}
