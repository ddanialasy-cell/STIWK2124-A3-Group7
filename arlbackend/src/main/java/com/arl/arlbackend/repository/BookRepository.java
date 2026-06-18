package com.arl.arlbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.arl.arlbackend.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByBookTitleContainingIgnoreCase(String bookTitle, Pageable pageable);

}
