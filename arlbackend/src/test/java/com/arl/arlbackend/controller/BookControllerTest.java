package com.arl.arlbackend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.arl.arlbackend.config.SecurityConfig;
import com.arl.arlbackend.exception.ResourceNotFoundException;
import com.arl.arlbackend.model.Book;
import com.arl.arlbackend.service.BookService;

/**
 * Web-layer tests for {@link BookController}. The real {@link SecurityConfig}
 * is imported so the Basic Auth rules are exercised; the service is mocked.
 */
@WebMvcTest(BookController.class)
@Import(SecurityConfig.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
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

    /** Build a JSON request body; pass a blank title to trigger validation. */
    private String bookJson(String title) {
        return """
                {
                  "bookTitle": "%s",
                  "bookAuthor": "Robert C. Martin",
                  "bookDescription": "A handbook of agile software craftsmanship.",
                  "bookCategory": "Programming"
                }
                """.formatted(title);
    }

    // ---------- READ (public) ----------

    @Test
    void getBookById_returns200_withoutAuth() throws Exception {
        when(bookService.getBookById(1L)).thenReturn(sampleBook());

        mockMvc.perform(get("/api/books/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookTitle").value("Clean Code"));
    }

    @Test
    void getBookById_whenMissing_returns404() throws Exception {
        when(bookService.getBookById(99L))
                .thenThrow(new ResourceNotFoundException("Book not found with id 99"));

        mockMvc.perform(get("/api/books/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ---------- WRITE (secured) ----------

    @Test
    void createBook_withoutAuth_returns401() throws Exception {
        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson("Clean Code")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createBook_withAuthAndValidData_returns201() throws Exception {
        when(bookService.saveBook(any(Book.class))).thenReturn(sampleBook());

        mockMvc.perform(post("/api/books")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson("Clean Code")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookTitle").value("Clean Code"));
    }

    @Test
    void createBook_withAuthButInvalidData_returns400() throws Exception {
        // Blank title violates @NotBlank -> validation fails before the service runs.
        mockMvc.perform(post("/api/books")
                        .with(httpBasic("admin", "admin123"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson("")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void createBook_withWrongPassword_returns401() throws Exception {
        mockMvc.perform(post("/api/books")
                        .with(httpBasic("admin", "wrongpassword"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookJson("Clean Code")))
                .andExpect(status().isUnauthorized());
    }
}
