import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './book.html',
  styleUrl: './book.css',
})

export class Book {

}

export interface Book {
  bookID: number;
  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookCategory: string;
}

export interface BookPageResponse {
  content: Book[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
