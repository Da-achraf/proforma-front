import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { RequestModel } from '../../../models/request.model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';
import { TABLE_PAGE_SIZE } from './data';
import { queryParamsByRole } from './helpers';
import { RoleEnum } from '../../../models/user/user.model';

type RequestState = {
  requests: RequestModel[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  trigger: number;
  filterParams: { [key: string]: any };
  loading: boolean;
  //   filterParams: {
  //     userId?: number;
  //     shipPointIds?: number[];
  //     status?: number;
  //     fromDate?: Date;
  //     toDate?: Date;
  //     searchTerm?: string;
  //   };
};

const initialState: RequestState = {
  requests: [],
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  trigger: 0,
  filterParams: {},
  loading: true,
  //   filterParams: {
  //     userId: undefined,
  //     shipPointIds: undefined,
  //     status: undefined,
  //     fromDate: undefined,
  //     toDate: undefined,
  //     searchTerm: undefined,
  //   },
};

export const RequestStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withProps(() => ({
    requestService: inject(RequestService),
    authService: inject(AuthService),
    initialPageSize: inject(TABLE_PAGE_SIZE),
  })),

  withComputed(({ trigger, page, pageSize, filterParams }) => ({
    pageAndSizeSignal: computed(() => {
      trigger();
      return {
        page: page(),
        pageSize: pageSize(),
        filterParams: filterParams(),
      };
    }),
  })),

  withMethods(({ requestService, ...store }) => ({
    load: rxMethod<{
      page: number;
      pageSize: number;
      filterParams?: { [key: string]: any };
    }>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        tap(({ page, pageSize, filterParams }) =>
          patchState(store, { page, pageSize, filterParams })
        ),
        debounceTime(1000),
        switchMap(({ page, pageSize, filterParams }) =>
          requestService.load(page, pageSize, filterParams).pipe(
            tapResponse({
              next: (response) => {
                patchState(store, { requests: response.items });
                patchState(store, {
                  page: response.page,
                  pageSize: response.pageSize,
                  totalItems: response.totalItems,
                });
              },
              error: (err: HttpErrorResponse) => {
                if (err.status === HttpStatusCode.NotFound) {
                  patchState(store, { requests: [], page: 1, totalItems: 0 });
                }
              },
              finalize: () => patchState(store, { loading: false }),
            })
          )
        )
      )
    ),

    setQueryParams: (filterParams: { [key: string]: any }) => {
      patchState(store, {
        filterParams: { ...store.filterParams(), ...filterParams },
        trigger: store.trigger() + 1,
      });
    },

    triggerReloading() {
      patchState(store, { trigger: store.trigger() + 1 });
    },

    setPagination: (page: number, pageSize: number) => {
      patchState(store, { page, pageSize, trigger: store.trigger() + 1 });
    },
  })),
  withHooks(
    ({
      load,
      pageAndSizeSignal,
      initialPageSize,
      setPagination,
      setQueryParams,
      authService,
    }) => ({
      onInit: async () => {
        const userId = authService.getUserIdFromToken();
        const loggedInUser = await authService.getUserById(userId);

        const queryParams = queryParamsByRole(
          loggedInUser.role as RoleEnum,
          loggedInUser
        );

        setPagination(1, initialPageSize);
        setQueryParams(queryParams);
        load(pageAndSizeSignal);
      },
    })
  )
);
