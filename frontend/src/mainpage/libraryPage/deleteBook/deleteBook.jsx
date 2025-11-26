import React, { useEffect, useState } from "react";
import "./deleteBooks.css";

export default function DeleteBooks() {
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
      // Only keep available books
      const available = Array.isArray(data)
        ? data.filter((b) => b.status === "available")
        : [];
      setBooks(available);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/books/${bookId}/`, {
        method: "DELETE", // or POST if your API expects it
      });
      if (!res.ok) throw new Error("Failed to delete book");
      await res.json().catch(() => {}); // ignore empty body
      fetchBooks(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading available books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="delete-books-page">
      <h1>Delete Books</h1>
      <table className="delete-books-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.book_name}</td>
              <td>{b.author}</td>
              <td>{b.status}</td>
              <td>
                <button onClick={() => deleteBook(b.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                No available books to delete
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
