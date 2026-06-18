import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { Book, BookPageResponse } from '../book/book';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  private apiUrl = 'http://localhost:8080/api/books';

  // Abort a request that hangs for more than 10 seconds.
  private readonly TIMEOUT_MS = 10000;

  constructor(private http: HttpClient) {}

  getBooks(page: number = 0, size: number = 10, search?: string): Observable<BookPageResponse> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }

    return this.http.get<BookPageResponse>(this.apiUrl, { params }).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  addBook(bookData: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, bookData).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  editBook(id: number, bookData: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, bookData).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  removeBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      timeout(this.TIMEOUT_MS),
      catchError(this.handleError)
    );
  }

  /** Maps low-level HTTP/timeout failures to a friendly, user-facing message. */
  private handleError(error: unknown) {
    let message = 'Something went wrong. Please try again.';

    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          message = 'Cannot reach the server. Is the backend running?';
          break;
        case 400:
          message = 'Invalid data. Please check the form and try again.';
          break;
        case 401:
        case 403:
          message = 'You must be logged in to perform this action.';
          break;
        case 404:
          message = 'The requested book was not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    } else if (error instanceof Error && error.name === 'TimeoutError') {
      message = 'The request timed out. Please try again.';
    }

    return throwError(() => new Error(message));
  }
}
