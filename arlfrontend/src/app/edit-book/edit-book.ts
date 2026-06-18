import { Component , signal, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../book/book';
import { BookService } from '../book-service/book-service';

@Component({
  selector: 'app-edit-book',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './edit-book.html',
  styleUrl: './edit-book.css',
})
export class EditBook {
  searchBookID: number | null = null;

  retrievedBook: Book = {
    bookID: 0,
    bookTitle: '',
    bookAuthor: '',
    bookDescription: '',
    bookCategory: ''
  };

  alertMessage = signal<string>('');
  alertClass = signal<string>('alert-primary')

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef){}

  clearForm(): void {
    this.retrievedBook = {
      bookID: 0,
      bookTitle: '',
      bookAuthor: '',
      bookDescription: '',
      bookCategory: ''
    };
  }

  editSearchBook(): void {
    if (!this.searchBookID) return;

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

  editBook(): void {
    if (this.retrievedBook.bookID === 0) return;

    this.bookService.editBook(this.retrievedBook.bookID, this.retrievedBook).subscribe({
      next: (editBook) => {
        this.alertClass.set('alert-success');
        this.alertMessage.set(`${editBook.bookTitle} has been updated`);
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.alertMessage.set('');
          this.clearForm();
          this.searchBookID = null;
          this.cdr.detectChanges();
        }, 3000);
      },

      error: (err) => {
        this.alertClass.set('alert-danger');
        this.alertMessage.set(err.message ?? 'Failed to update the book');
        this.cdr.detectChanges();
      }
    });
  }
}
