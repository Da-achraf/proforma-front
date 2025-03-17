import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import 'chartjs-adapter-date-fns';
import { BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { provideEchartsCore } from 'ngx-echarts';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import {
  PAGE_SIZE_OPTIONS,
  TABLE_PAGE_SIZE,
} from './app/shared/components/tables/data';

echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#FFF8F2', // Lightest - Almost white with a hint of orange
      100: '#FFECD9', // Very light orange
      200: '#FFD9B3', // Light orange
      300: '#FFC78C', // Medium-light orange
      400: '#FFB366', // Less light orange
      500: '#FF8C1A', // Main color - Vibrant orange
      600: '#E67300', // Slightly darker
      700: '#CC6600', // Darker orange
      800: '#B35900', // Very dark orange
      900: '#994D00', // Nearly black orange
      950: '#663300', // Deepest orange, almost brown
    },
  },
});

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    provideEchartsCore({ echarts }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    {
      provide: TABLE_PAGE_SIZE,
      useValue: 2,
    },
    {
      provide: PAGE_SIZE_OPTIONS,
      useValue: [2, 20, 50, 100],
    },
    providePrimeNG({
      ripple: true,

      theme: {
        options: {
          darkModeSelector: '.my-app-dark',
        },
        preset: MyPreset,
      },
    }),
    MessageService,
  ],
}).catch((err) => console.error(err));
