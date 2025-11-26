import React, { useEffect, useState } from "react";
import "./borrowReturn.css";

export default function BorrowedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8080/books/");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      // Only keep borrowed books
      const borrowed = Array.isArray(data)
        ? data.filter((b) => b.status === "borrowed")
        : [];
      setBooks(borrowed);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const returnBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/books/return/${bookId}/`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to return book");
      await res.json();
      fetchBooks(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading borrowed books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="borrowed-books-page">
      <h1>Borrowed Books</h1>
      <table className="borrowed-books-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Student ID</th>
            <th>Return</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.book_name}</td>
              <td>{b.author}</td>
              <td>{b.borrower_name || b.student_id}</td>
              <td>
                <button onClick={() => returnBook(b.id)}>Return</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No borrowed books
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
