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
import { debounceTime, lastValueFrom, pipe, switchMap, tap } from 'rxjs';
import { RequestModel } from '../../../models/request.model';
import { RoleEnum } from '../../../models/user/user.model';
import { AuthService } from '../../../services/auth.service';
import { RequestExportService } from '../../../services/request-export.service';
import { RequestService } from '../../../services/request.service';
import { TABLE_PAGE_SIZE } from './data';
import { queryParamsByRole } from './helpers';
import { ToasterService } from '../../services/toaster.service';
import { QueryParamType } from '../../../models/api-types.model';

type RequestState = {
  requests: RequestModel[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  trigger: number;
  filterParams: QueryParamType;
  loading: boolean;
  isExporting: boolean;
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
  isExporting: false,
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
    requestExportService: inject(RequestExportService),
    authService: inject(AuthService),
    initialPageSize: inject(TABLE_PAGE_SIZE),
    toaster: inject(ToasterService),
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

  withMethods(({ requestService, requestExportService, ...store }) => ({
    load: rxMethod<{
      page: number;
      pageSize: number;
      filterParams?: QueryParamType;
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

    setQueryParams: (filterParams: QueryParamType) => {
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

  withMethods(({ requestExportService, filterParams, toaster, ...store }) => ({
    exportReport: async (queryParams: QueryParamType) => {
      try {
        patchState(store, { isExporting: true });
        const blob = await lastValueFrom(
          requestExportService.exportRequestsReport({
            ...filterParams(),
            ...queryParams,
          })
        );

        requestExportService.downloadBlob(
          blob,
          `Requests_Export_${new Date().toISOString()}.xlsx`
        );
      } catch (error) {
        toaster.showInfo('No data found for export');
      } finally {
        patchState(store, { isExporting: false });
      }
    },

    getReportPreview: async (queryParams: QueryParamType) => {
      try {
        const report = await lastValueFrom(
          requestExportService.getReportPreview({
            ...filterParams(),
            ...queryParams,
          })
        );

      } catch (error) {
        toaster.showInfo('No data found for preview');
      }
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
