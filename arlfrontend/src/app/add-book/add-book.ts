import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { Book } from '../book/book';
import { BookService } from '../book-service/book-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-book',
  imports:  [FormsModule],
  standalone: true,
  templateUrl: './add-book.html',
  styleUrl: './add-book.css',
})
export class AddBook {
  newBook: Book = {
    bookID: 0,
    bookTitle: '',
    bookAuthor: '',
    bookDescription: '',
    bookCategory: ''
  };

  addSuccess = signal<string>('');
  addError = signal<string>('');

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef){}

  addBook(): void {
    this.addError.set('');
    this.bookService.addBook(this.newBook).subscribe({
      next: (savedBook) => {
        this.addSuccess.set(`Successfully added "${savedBook.bookTitle}"`);
        this.resetForm();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.addSuccess.set('');
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.addError.set(err.message ?? 'Error adding book.');
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.newBook = {
      bookID: 0,
      bookTitle: '',
      bookAuthor: '',
      bookDescription: '',
      bookCategory: ''
    };
  }
}
