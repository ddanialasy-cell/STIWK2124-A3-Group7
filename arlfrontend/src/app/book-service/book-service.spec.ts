import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BookService } from './book-service';
import { Book, BookPageResponse } from '../book/book';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/books';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBooks should request the correct URL with paging params', () => {
    const mockResponse: BookPageResponse = {
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: 10,
      number: 0,
      first: true,
      last: true,
    };

    service.getBooks(0, 10).subscribe((res) => {
      expect(res.totalPages).toBe(1);
    });

    const req = httpMock.expectOne(
      (r) => r.url === apiUrl && r.params.get('page') === '0' && r.params.get('size') === '10',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('addBook should POST the book payload', () => {
    const newBook: Book = {
      bookID: 0,
      bookTitle: 'Clean Code',
      bookAuthor: 'Robert C. Martin',
      bookDescription: 'A handbook of agile software craftsmanship.',
      bookCategory: 'Programming',
    };

    service.addBook(newBook).subscribe((res) => {
      expect(res.bookTitle).toBe('Clean Code');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.bookTitle).toBe('Clean Code');
    req.flush({ ...newBook, bookID: 1 });
  });

  it('should map a 404 error to a friendly message', () => {
    service.getBookById(99).subscribe({
      next: () => {
        throw new Error('expected an error, not success');
      },
      error: (err: Error) => {
        expect(err.message).toBe('The requested book was not found.');
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/99`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
