import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductoService } from './producto.service';
import { apiUrl } from '../url/url';
import { Product } from '../models/Product';

describe('ProductoService', () => {
  let service: ProductoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductoService],
    });

    service = TestBed.inject(ProductoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve products from API via GET', () => {
    const dummyProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: '2021-01-01',
        date_revision: '2022-01-01',
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo2.png',
        date_release: '2021-02-01',
        date_revision: '2022-02-01',
      },
    ];

    service.getProducts().subscribe((response) => {
      expect(response.data.length).toBe(2);
      expect(response.data).toEqual(dummyProducts);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush({ data: dummyProducts });
  });

  it('should verify product ID via GET', () => {
    const id = '123';
    service.verificarProducto(id).subscribe((response) => {
      expect(response).toEqual({ valid: true });
    });

    const request = httpMock.expectOne(`${apiUrl}/verification/${id}`);
    expect(request.request.method).toBe('GET');
    request.flush({ valid: true });
  });

  it('should add a product via POST', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Product 3',
      description: 'Description 3',
      logo: 'logo3.png',
      date_release: '2021-03-01',
      date_revision: '2022-03-01',
    };

    service.agregarProducto(newProduct).subscribe((response) => {
      expect(response).toEqual(newProduct);
    });

    const request = httpMock.expectOne(apiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newProduct);
    request.flush(newProduct);
  });

  it('should update a product via PUT', () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updatedLogo.png',
      date_release: '2021-01-01',
      date_revision: '2022-01-01',
    };

    service.actualizarProducto('1', updatedProduct).subscribe((response) => {
      expect(response).toEqual(updatedProduct);
    });

    const request = httpMock.expectOne(`${apiUrl}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedProduct);
    request.flush(updatedProduct);
  });

  it('should delete a product via DELETE', () => {
    const id = '1';

    service.eliminarProducto(id).subscribe((response) => {
      expect(response).toBe(null);
    });

    const request = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should verify if an ID exists via GET', () => {
    const id = '123';
    
    service.verificarId(id).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const request = httpMock.expectOne(`${apiUrl}/verification/${id}`);
    expect(request.request.method).toBe('GET');
    request.flush(true);
  });
});
