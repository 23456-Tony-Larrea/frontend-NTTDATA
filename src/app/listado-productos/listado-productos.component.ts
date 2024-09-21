import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../messages/toast/toast.component';
import { BackendMessages, BackendMessagesInterface, SpecificErrorMessages } from '../messages/toast-backend/backend-messages';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../models/Product';


@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListadoProductosComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  itemsPerPage: number = 5;
  dropdownOpen: string | null = null;
  showDeleteModal: boolean = false;
  productIdToDelete: string | null = null;
  loading: boolean = true;
  placeholders: any[] = []; 
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(private productService: ProductoService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.placeholders = new Array(5).fill({}); 
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(response => {
      this.products = response.data;
      this.filteredProducts = this.products;
      this.loading = false; 
      this.cdr.markForCheck();
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onItemsPerPageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(selectElement.value, 10);
  }

  addProduct(): void {
    this.router.navigate(['/create-product']);
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.productIdToDelete = null;
  }

  toggleDropdown(productId: string): void {
    this.dropdownOpen = this.dropdownOpen === productId ? null : productId;
  }

  editProduct(productId: string): void {
    this.router.navigate(['/productos/editar', productId]);
  }

  confirmDeleteProduct(productId: string): void {
    this.productIdToDelete = productId;
    this.showDeleteModal = true;
  }

  deleteProduct(): void {
    if (this.productIdToDelete) {
      this.productService.eliminarProducto(this.productIdToDelete).subscribe(
        response => {
          if (response.status === 200) {
            this.showToast(BackendMessages[200], 'success');
            this.loadProducts();
          }
          this.showDeleteModal = false;
          this.productIdToDelete = null;
        },
        error => {
          const errorMessage = SpecificErrorMessages[error.error.message as keyof typeof SpecificErrorMessages] || BackendMessages[error.status as keyof BackendMessagesInterface] || 'Error desconocido';
          this.showToast(errorMessage, 'error');
        }
      );
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productIdToDelete = null;
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastComponent) {
      this.toastComponent.message = message;
      this.toastComponent.backgroundColor = type === 'success' ? 'green' : 'red';
      this.toastComponent.ngOnInit();
    } else {
      console.error('ToastComponent is not available');
    }
  }
}
