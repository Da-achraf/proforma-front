import { Component, input, output, signal } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { PageEvent } from "@angular/material/paginator";

@Component({
    selector: 'ba-paginator',
    template: `
        <mat-paginator [color]="color()" [length]="total()" [pageSize]="rows()"
        [showFirstLastButtons]="showFirstLastButtons()" [pageSizeOptions]="pageSizeOptions()" (page)="onPageChange($event)"
        aria-label="Select page">
    </mat-paginator>
    `,
})
export class PaginatorComponent {

    readonly total = input.required<number>()
    readonly showFirstLastButtons = input<boolean>(true)
    readonly color = input<ThemePalette>('primary')
    readonly pageSizeOptions = input<number[]>([25, 50, 100, 200])

    readonly page = output<number>()
    readonly pageSize = output<number>()

    protected rows = signal(25)
    protected first = signal(0)

    protected onPageChange(event: PageEvent) {
        const { pageIndex, pageSize } = event;

        if (typeof pageIndex === 'number' && typeof pageSize === 'number') {
            this.first.set(pageIndex * pageSize)
            this.rows.set(pageSize)

            this.page.emit(pageIndex + 1)
            this.pageSize.emit(pageSize)
        }
    }
}