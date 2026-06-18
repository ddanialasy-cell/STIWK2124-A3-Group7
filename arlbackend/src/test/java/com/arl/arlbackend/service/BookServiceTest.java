package com.arl.arlbackend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.arl.arlbackend.exception.ResourceNotFoundException;
import com.arl.arlbackend.model.Book;
import com.arl.arlbackend.repository.BookRepository;

/**
 * Unit tests for {@link BookService} using Mockito (no database needed).
 * Covers both success and failure paths.
 */
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book sampleBook() {
        Book book = new Book();
        book.setBookID(1L);
        book.setBookTitle("Clean Code");
        book.setBookAuthor("Robert C. Martin");
        book.setBookDescription("A handbook of agile software craftsmanship.");
        book.setBookCategory("Programming");
        return book;
    }

    // ---------- SUCCESS PATHS ----------

    @Test
    void getBookById_whenBookExists_returnsBook() {
        Book book = sampleBook();
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Book result = bookService.getBookById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getBookTitle()).isEqualTo("Clean Code");
        verify(bookRepository, times(1)).findById(1L);
    }

    @Test
    void saveBook_persistsAndReturnsBook() {
        Book book = sampleBook();
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        Book result = bookService.saveBook(book);

        assertThat(result.getBookAuthor()).isEqualTo("Robert C. Martin");
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void updateBook_whenBookExists_updatesFields() {
        Book existing = sampleBook();
        Book update = new Book();
        update.setBookTitle("Clean Code (2nd Ed)");
        update.setBookAuthor("Robert C. Martin");
        update.setBookDescription("Updated edition.");
        update.setBookCategory("Programming");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(bookRepository.save(any(Book.class))).thenReturn(existing);

        Book result = bookService.updateBook(1L, update);

        assertThat(result.getBookTitle()).isEqualTo("Clean Code (2nd Ed)");
        verify(bookRepository).save(existing);
    }

    // ---------- FAILURE PATHS ----------

    @Test
    void getBookById_whenBookMissing_throwsResourceNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.getBookById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(bookRepository, never()).save(any());
    }

    @Test
    void deleteBook_whenBookMissing_throwsAndDoesNotDelete() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.deleteBook(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(bookRepository, never()).deleteById(anyLong());
    }
}
