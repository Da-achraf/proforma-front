import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  setAllEntities,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { ScenarioModel } from '../../models/scenario.model';
import { DeleteDialogComponent } from '../../pattern/dialogs/delete-dialog.component';
import { ScenarioService } from '../../services/scenario.service';
import { AddScenarioComponent } from './add-scenario/add-scenario.component';
import { EditScenarioComponent } from './edit-scenario/edit-scenario.component';

type ScenariosState = {
  loading: boolean;
};
const initialState: ScenariosState = {
  loading: false,
};

/**
 * Normally, the withEntities api from ngrx signal store expects that
 * the entity identifier is named 'id', but it can overriden in selectId
 */
const scenarioConfig = entityConfig({
  entity: type<ScenarioModel>(),
  selectId: (scenario) => scenario.id_scenario,
});

export const ScenarioStore = signalStore(
  { providedIn: 'root' },
  withState<ScenariosState>(initialState),
  withEntities(scenarioConfig),

  withProps(() => ({
    scenarioService: inject(ScenarioService),
    dialog: inject(MatDialog),
    destroyRef: inject(DestroyRef),
  })),

  withComputed(({ entities }) => ({
    total: computed(() => entities().length),
  })),

  withMethods(({ scenarioService, ...store }) => ({
    // Add a new scenario
    addScenario: (scenario: ScenarioModel) => {
      patchState(store, addEntity(scenario, scenarioConfig));
    },

    // Update an existing scenario
    updateScenario: rxMethod<ScenarioModel>(
      pipe()
      // switchMap((scenario) =>
      //   scenarioService.(scenario.id_scenario, scenario).pipe(
      //     tapResponse({
      //       next: (updatedScenario) =>
      //         patchState(store, updateEntity(updatedScenario, { selectId })),
      //       error: console.log,
      //     })
      //   )
      // )
    ),

    // Delete a scenario
    deleteScenario: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((id) =>
          scenarioService.deleteScenarios(id).pipe(
            tapResponse({
              next: () => patchState(store, removeEntity(id)),
              error: console.log,
              finalize: () => patchState(store, { loading: false }),
            })
          )
        )
      )
    ),
  })),

  withMethods(
    ({
      scenarioService,
      addScenario,
      deleteScenario,
      entities,
      entityMap,
      loading,
      dialog,
      destroyRef,
      ...store
    }) => ({
      // Load all scenarios
      loadScenarios: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap(() =>
            scenarioService.getScenarios().pipe(
              filter((data) => data.length != 0),
              tapResponse({
                next: (scenarios) =>
                  patchState(store, setAllEntities(scenarios, scenarioConfig)),
                error: console.log,
                finalize: () => patchState(store, { loading: false }),
              })
            )
          )
        )
      ),

      openCreateScenarioDialog: () => {
        dialog
          .open(AddScenarioComponent, {
            maxHeight: '80vh',
          })
          .afterClosed()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: (res) => {
              if (res && res?.scenario) addScenario(res.scenario);
            },
          });
      },

      openUpdateScenarioDialog: (id: number) => {
        dialog
          .open(EditScenarioComponent, {
            maxHeight: '80vh',
            data: {
              scenario: entityMap()[id],
            },
          })
          .afterClosed()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: (res) => {
              if (res && res?.scenario) addScenario(res.scenario);
            },
          });
      },

      openDeleteScenarioDialog: (id: number) => {
        dialog
          .open(DeleteDialogComponent, {
            data: { label: 'scenario' },
            minWidth: '40vw',
            maxHeight: '95vh',
          })
          .afterClosed()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: (res) => {
              if (res && res?.type === 'delete') deleteScenario(id);
            },
          });
      },
    })
  ),
  withHooks(({ loadScenarios }) => ({
    onInit: () => loadScenarios(),
  }))
);
