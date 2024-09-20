import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { Router } from '@angular/router';
import { BackendMessages, BackendMessagesInterface, SpecificErrorMessages } from '../messages/toast-backend/backend-messages';
import { ToastComponent } from '../messages/toast/toast.component';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { format } from 'date-fns';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(private fb: FormBuilder, private productService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idValidator.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateValidator()]],
      date_revision: ['', [Validators.required, this.oneYearLaterValidator()]]
    });
  }

  onSubmit(): void {
    const product = this.productForm.value;
    product.date_release = format(new Date(product.date_release), 'yyyy-MM-dd');
    product.date_revision = format(new Date(product.date_revision), 'yyyy-MM-dd');
    this.productService.agregarProducto(product).subscribe(
      response => {
        this.showToast(BackendMessages[200], 'success');
        this.router.navigate(['/listado-productos']);
      },
      error => {
        const errorMessage = SpecificErrorMessages[error.error.message] || BackendMessages[error.status as keyof BackendMessagesInterface] || 'Error desconocido';
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

  private idValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.productService.verificarId(value)),
      map(exists => (exists ? { idExists: true } : null)),
      catchError(() => of(null))
    );
  }

  onCancel(): void {
    this.router.navigate(['/productos']);
  }

  public showToast(message: string, type: 'success' | 'error'): void { // Cambiado a public
    this.toastComponent.message = message;
    this.toastComponent.backgroundColor = type === 'success' ? 'green' : 'red';
    this.toastComponent.ngOnInit();
  }
}