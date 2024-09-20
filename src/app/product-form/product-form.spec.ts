import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductFormComponent } from './product-form.component';
import { ProductoService } from '../services/producto.service';
import { ToastComponent } from '../messages/toast/toast.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jasmine.SpyObj<ProductoService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductoService', ['agregarProducto', 'verificarId']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent, ToastComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductoService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductoService) as jasmine.SpyObj<ProductoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.productForm;
    expect(form).toBeDefined();
    expect(form.get('id')?.value).toBe('');
    expect(form.get('name')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('logo')?.value).toBe('');
    expect(form.get('date_release')?.value).toBe('');
    expect(form.get('date_revision')?.value).toBe('');
  });

  it('should validate the form fields correctly', () => {
    const form = component.productForm;
    form.get('id')?.setValue('');
    form.get('name')?.setValue('');
    form.get('description')?.setValue('');
    form.get('logo')?.setValue('');
    form.get('date_release')?.setValue('');
    form.get('date_revision')?.setValue('');

    expect(form.get('id')?.valid).toBeFalse();
    expect(form.get('name')?.valid).toBeFalse();
    expect(form.get('description')?.valid).toBeFalse();
    expect(form.get('logo')?.valid).toBeFalse();
    expect(form.get('date_release')?.valid).toBeFalse();
    expect(form.get('date_revision')?.valid).toBeFalse();
  });

  it('should submit the form and navigate on success', () => {
    const form = component.productForm;
    form.get('id')?.setValue('123');
    form.get('name')?.setValue('Product Name');
    form.get('description')?.setValue('Product Description');
    form.get('logo')?.setValue('logo.png');
    form.get('date_release')?.setValue('2023-01-01');
    form.get('date_revision')?.setValue('2024-01-01');

    productService.agregarProducto.and.returnValue(of({}));

    component.onSubmit();

    expect(productService.agregarProducto).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/listado-productos']);
  });

  it('should show error message on submission failure', () => {
    const form = component.productForm;
    form.get('id')?.setValue('123');
    form.get('name')?.setValue('Product Name');
    form.get('description')?.setValue('Product Description');
    form.get('logo')?.setValue('logo.png');
    form.get('date_release')?.setValue('2023-01-01');
    form.get('date_revision')?.setValue('2024-01-01');

    productService.agregarProducto.and.returnValue(throwError({ error: { message: 'error' }, status: 400 }));

    spyOn(component, 'showToast');

    component.onSubmit();

    expect(productService.agregarProducto).toHaveBeenCalled();
    expect(component.showToast).toHaveBeenCalledWith('Solicitud incorrecta. Verifique la información proporcionada.', 'error');
  });

  it('should reset the form on reset', () => {
    const form = component.productForm;
    form.get('id')?.setValue('123');
    form.get('name')?.setValue('Product Name');
    form.get('description')?.setValue('Product Description');
    form.get('logo')?.setValue('logo.png');
    form.get('date_release')?.setValue('2023-01-01');
    form.get('date_revision')?.setValue('2024-01-01');

    component.onReset();

    expect(form.get('id')?.value).toBeNull();
    expect(form.get('name')?.value).toBeNull();
    expect(form.get('description')?.value).toBeNull();
    expect(form.get('logo')?.value).toBeNull();
    expect(form.get('date_release')?.value).toBeNull();
    expect(form.get('date_revision')?.value).toBeNull();
  });

  it('should navigate to /productos on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/productos']);
  });
});