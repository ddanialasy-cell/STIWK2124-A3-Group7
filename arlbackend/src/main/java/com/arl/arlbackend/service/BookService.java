package com.arl.arlbackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.arl.arlbackend.exception.ResourceNotFoundException;
import com.arl.arlbackend.model.Book;
import com.arl.arlbackend.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Page<Book> searchBook(String bookTitle, Pageable pageable) {
        return bookRepository.findByBookTitleContainingIgnoreCase(bookTitle, pageable);
    }

   public Book getBookById(Long id) {
        return bookRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    public Book updateBook(Long id, Book bookUpdate) {
        Book book = getBookById(id);

        if (book != null) {
            book.setBookTitle(bookUpdate.getBookTitle());
            book.setBookAuthor(bookUpdate.getBookAuthor());
            book.setBookDescription(bookUpdate.getBookDescription());
            book.setBookCategory(bookUpdate.getBookCategory());

            return bookRepository.save(book);
        }

        return null;
    }

    public void deleteBook(Long id) {
        getBookById(id);
        bookRepository.deleteById(id);
    }
}
