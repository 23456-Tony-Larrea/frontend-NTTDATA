import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../services/producto.service';
import { BackendMessages, BackendMessagesInterface, SpecificErrorMessages } from '../messages/toast-backend/backend-messages';
import { ToastComponent } from '../messages/toast/toast.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  productForm!: FormGroup;
  productId!: string;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productForm = this.fb.group({
      id: [{ value: this.productId, disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateValidator()]],
      date_revision: ['', [Validators.required, this.oneYearLaterValidator()]]
    });

    this.productService.getProducts().subscribe(response => {
      const product = response.data.find(p => p.id === this.productId);
      if (product) {
        this.productForm.patchValue(product);
      } else {
        console.error('Product not found');
        this.router.navigate(['/productos']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.toastComponent) {
      console.error('ToastComponent not initialized');
    }
  }

  onSubmit(): void {
      this.productForm.get('id')?.enable();
      const product = this.productForm.getRawValue();
      this.productForm.get('id')?.disable();

      this.productService.actualizarProducto(this.productId, product).subscribe(
        response => {
          this.showToast(BackendMessages[200], 'success');
          this.router.navigate(['/listado-productos']);
        },
        error => {
          const errorMessage = this.extractErrorMessage(error);
          this.showToast(errorMessage, 'error');
        }
      );
  }

  onReset(): void {
    this.productForm.reset();
  }

  private dateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const controlDate = new Date(control.value);
      return controlDate >= currentDate ? null : { min: true };
    };
  }

  private oneYearLaterValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const releaseDate = new Date(this.productForm?.get('date_release')?.value);
      const revisionDate = new Date(control.value);
      const oneYearLater = new Date(releaseDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      return revisionDate.getTime() === oneYearLater.getTime() ? null : { 'is-one-year-later': true };
    };
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
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

  private extractErrorMessage(error: any): string {
    if (error.errors && error.errors.length > 0) {
      return error.errors.map((err: any) => err.constraints ? Object.values(err.constraints).join(', ') : err.message).join(', ');
    }
    return error.message || 'Error desconocido';
  }
}