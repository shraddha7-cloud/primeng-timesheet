import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/product.model';
import { FormsModule } from '@angular/forms';

import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';




@Component({
  selector: 'app-timesheet-grid',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, CommonModule, ButtonModule, ToastModule, FormsModule],
  templateUrl: './timesheet-grid.component.html',
  styleUrls: ['./timesheet-grid.component.css'],
providers: [ProductService, MessageService]
})
export class TimesheetGridComponent implements OnInit {

  products!: Product[];

    expandedRows = {};

  constructor(private productService: ProductService, private messageService: MessageService) {}

  ngOnInit(): void {
      this.productService.getProductsWithOrdersSmall().then((data) => (this.products = data));
    }

    expandAll() {
  this.expandedRows = this.products.reduce((acc: { [key: string]: boolean }, p) => {
    acc[p.id] = true;
    return acc;
  }, {});
}


    collapseAll() {
        this.expandedRows = {};
    }    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info'; // Default case to handle any other status
        }
    }    getStatusSeverity(status: string) {
        switch (status) {
            case 'PENDING':
                return 'warn';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'info'; // Default case to handle any other status
        }
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }
}


