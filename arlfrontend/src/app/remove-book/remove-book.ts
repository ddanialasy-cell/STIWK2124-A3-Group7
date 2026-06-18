import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { BookService } from '../book-service/book-service';
import { Book } from '../book/book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remove-book',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './remove-book.html',
  styleUrl: './remove-book.css',
})
export class RemoveBook {
  searchBookID: number | null = null;

  retrievedBook: Book = {
    bookID: 0,
    bookTitle: '',
    bookAuthor: '',
    bookDescription: '',
    bookCategory: ''
  };

  alertMessage = signal<string>('');
  alertClass = signal<string>('alert-primary');

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef) {}
  
  clearForm(): void {
    this.retrievedBook = {
      bookID: 0,
      bookTitle: '',
      bookAuthor: '',
      bookDescription: '',
      bookCategory: ''
    };
  }

  searchDeleteBook(): void {

    if(!this.searchBookID) return;

    this.bookService.getBookById(this.searchBookID).subscribe({
      next: (foundBook) => {
        this.retrievedBook = foundBook;
        this.alertMessage.set('');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.alertClass.set('alert-danger');
        this.alertMessage.set(err.message ?? `Book ID ${this.searchBookID} could not be found`);
        this.clearForm();
        this.cdr.detectChanges();
      }
    });
  }

  removeBook(): void {

    if (this.retrievedBook.bookID === 0) return;

    if (confirm(`Remove the book titled "${this.retrievedBook.bookTitle}" from database permanently?`)) {
      
      this.bookService.removeBook(this.retrievedBook.bookID).subscribe({
        next: () => {
          this.alertClass.set('alert-success');
          this.alertMessage.set('Remove successful');
          this.clearForm();
          this.searchBookID = null;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.alertMessage.set('');
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.alertClass.set('alert-danger');
          this.alertMessage.set(err.message ?? 'Failed to remove book');
          this.cdr.detectChanges();
        }
      });
    }
  }
}
