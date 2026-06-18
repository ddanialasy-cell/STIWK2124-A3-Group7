import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { BookService } from '../book-service/book-service';
import { Book } from '../book/book';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-library',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library implements OnInit{

  books: Book[] = [];
  searchTitle: string = '';
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  firstPage: boolean = true;
  lastPage: boolean = false;
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private bookService: BookService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBooks();
  }
  
  loadBooks(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.bookService.getBooks(this.currentPage, this.pageSize, this.searchTitle).subscribe({
      next: (data) => {
        this.books = data.content;
        this.totalPages = data.totalPages;
        this.firstPage = data.first;
        this.lastPage = data.last;
        this.loading.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.message ?? 'Error fetching books.');
        this.cdr.detectChanges();
      }
    });
  }

  searchBook(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  nextPage(): void {
    if (!this.lastPage) {
      this.currentPage++;
      this.loadBooks();
      this.cdr.detectChanges();
    }
  }

  prevPage(): void {
    if (!this.firstPage) {
      this.currentPage--;
      this.loadBooks()
      this.cdr.detectChanges();
    }
  }
}
