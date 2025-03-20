import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, ProviderToken } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, Observable, pipe } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { PagedResult, QueryParamType } from '../../core/models/api-types.model';
import { TABLE_PAGE_SIZE } from '../components/tables/data';
import { ToasterService } from './toaster.service';
import { withLoading } from './with-loading.store';

export interface WithPagedEntityState<T> {
  page: number;
  total: number;
  pageSize: number;
  item?: T;
  trigger: number;
  queryParams: QueryParamType;
}

export function withPagedEntities<Entity extends { id: number }, C, U>(
  Loader: ProviderToken<{
    load: (
      page: number,
      pageSize: number,
      queryParams?: { [key: string]: any },
    ) => Observable<PagedResult<Entity>>;
    update: (body: Partial<U>, id: number) => Observable<Entity>;
    save: (body: C) => Observable<Entity>;
    loadOne: (id: number) => Observable<Entity>;
    deleteMany: (ids: number[]) => Observable<void>;
    deleteOne: (id: number) => Observable<void>;
  }>,
) {
  return signalStoreFeature(
    withState<WithPagedEntityState<Entity>>({
      page: 1,
      total: 0,
      pageSize: 0,
      trigger: 0,
      queryParams: {},
    }),

    withLoading(),

    withProps(() => ({
      loader: inject(Loader),
      toaster: inject(ToasterService),
    })),

    withEntities<Entity>(),

    withComputed(({ trigger, page, pageSize, queryParams, loadingStates }) => ({
      pageAndSizeSignal: computed(() => {
        trigger();
        return {
          page: page(),
          pageSize: pageSize(),
          queryParams: queryParams(),
        };
      }),
      isLoading: computed(() => loadingStates()['load'] || false),
      isSaving: computed(() => loadingStates()['save'] || false),
      isUpdating: computed(() => loadingStates()['update'] || false),
      isDeleting: computed(() => loadingStates()['delete'] || false),
    })),

    withMethods(({ toaster, startLoading, stopLoading, loader, ...state }) => ({
      load: rxMethod<{
        page: number;
        pageSize: number;
        queryParams?: { [key: string]: any };
      }>(
        pipe(
          tap(() => startLoading('load')),
          tap(({ page, pageSize, queryParams }) =>
            patchState(state, { page, pageSize, queryParams }),
          ),
          debounceTime(1000),
          switchMap(({ page, pageSize, queryParams }) =>
            loader.load(page, pageSize, queryParams).pipe(
              tapResponse({
                next: (response) => {
                  patchState(
                    state,
                    setAllEntities(response.items as Entity[]),
                    { page: response.page, total: response.totalItems },
                  );
                },
                error: (err: HttpErrorResponse) => {
                  if (err.status === HttpStatusCode.NotFound) {
                    patchState(state, setAllEntities([] as Entity[]), {
                      page: 1,
                      total: 0,
                    });
                  }
                },
                finalize: () => stopLoading('load'),
              }),
            ),
          ),
        ),
      ),

      save: rxMethod<C>(
        pipe(
          tap(() => startLoading('save')), // Start loading for 'save'
          switchMap((body) =>
            loader.save(body).pipe(
              tapResponse({
                next: (response) => {
                  toaster.showSuccess('Created successfully.');
                  patchState(state, setEntity(response as Entity));
                },
                error: (error: HttpErrorResponse) => {
                  const errorMessage = error.error.message;
                  if (errorMessage) {
                    toaster.showError(errorMessage);
                  } else {
                    toaster.showError();
                  }
                },
                finalize: () => stopLoading('save'),
              }),
            ),
          ),
        ),
      ),

      update: rxMethod<{ body: Partial<U>; id: number }>(
        pipe(
          tap(() => startLoading('update')),
          switchMap(({ body, id }) =>
            loader.update(body, id).pipe(
              tapResponse({
                next: (response) => {
                  patchState(state, setEntity(response as Entity));
                  toaster.showSuccess('Updated successfully.');
                },
                error: (err) => {
                  console.error('Error updating: ', err);
                  toaster.showError();
                },
                finalize: () => {
                  stopLoading('update');
                },
              }),
            ),
          ),
        ),
      ),

      loadOne: rxMethod<number>(
        pipe(
          tap(() => startLoading('load')),
          switchMap((id) =>
            loader.loadOne(id).pipe(
              tapResponse({
                next: (response) => {
                  patchState(state, {
                    item: response as Entity,
                  });
                },
                error: () => toaster.showError(),
                finalize: () => {
                  stopLoading('load');
                },
              }),
            ),
          ),
        ),
      ),
      deleteOne: rxMethod<number>(
        pipe(
          tap(() => startLoading('delete')),
          switchMap((id) =>
            loader.deleteOne(id).pipe(
              tapResponse({
                next: (_) => {
                  patchState(state, removeEntity(id));
                  toaster.showSuccess('Deleted successfully.');
                },
                error: () => toaster.showError(),
                finalize: () => {
                  stopLoading('delete');
                },
              }),
            ),
          ),
        ),
      ),
      setPage: (page: number) => {
        patchState(state, { page, trigger: state.trigger() + 1 });
      },
      setPageSize: (pageSize: number) => {
        patchState(state, { pageSize, trigger: state.trigger() + 1 });
      },
      setQueryParams: (queryParams: { [key: string]: any }) => {
        patchState(state, { queryParams, trigger: state.trigger() + 1 });
      },
    })),
    withHooks(({ load, pageAndSizeSignal, setPageSize }) => {
      return {
        onInit: () => {
          setPageSize(inject(TABLE_PAGE_SIZE));
          load(pageAndSizeSignal);
        },
      };
    }),
  );
}
