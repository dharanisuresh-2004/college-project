// at the top imports
import React, { useEffect, useState } from "react";
import "./bookDetail.css";
import BorrowOverlay from "./BorrowOverlay"; // <— add this import

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // VIEW overlay (already in your page)
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayData, setOverlayData] = useState(null);

  // BORROW overlay state
  const [borrowOverlayVisible, setBorrowOverlayVisible] = useState(false);
  const [borrowBook, setBorrowBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:8080/books/");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Borrow button handler — opens overlay
  const openBorrowOverlay = (book) => {
    setBorrowBook(book);
    setBorrowOverlayVisible(true);
  };

  // Called by overlay on success: refresh and close
  const handleBorrowSuccess = async () => {
    await fetchBooks();
    setBorrowOverlayVisible(false);
    setBorrowBook(null);
  };

  const openViewOverlay = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8080/books/${bookId}`);
      if (!res.ok) throw new Error("Failed to fetch book details");
      const data = await res.json();
      setOverlayData(data);
      setOverlayVisible(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const closeViewOverlay = () => {
    setOverlayVisible(false);
    setOverlayData(null);
  };

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="book-list-page">
      <h1>Books</h1>
      <table className="books-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Status</th>
            <th>Borrow</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.book_name}</td>
              <td>{b.author}</td>
              <td>{b.status}</td>
              <td>
                <button
                    onClick={() => openBorrowOverlay(b)}
                    disabled={b.status !== "available"}
                >
                    Borrow
                </button>
              </td>
              <td>
                <button onClick={() => openViewOverlay(b.id)}>View</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No books available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View overlay (existing) */}
      {overlayVisible && overlayData && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>Book Details</h3>
            <div className="details-grid">
              <p><strong>ID:</strong> {overlayData.id}</p>
              <p><strong>Book Name:</strong> {overlayData.book_name}</p>
              <p><strong>Author:</strong> {overlayData.author}</p>
              <p><strong>Borrower Name:</strong> {overlayData.borrower_name}</p>
              <p><strong>Check-in Date:</strong> {overlayData.checkin_date}</p>
              <p><strong>Check-out Date:</strong> {overlayData.checkout_date}</p>
              <p><strong>Description:</strong> {overlayData.description}</p>
              <p><strong>Due Date:</strong> {overlayData.due_date}</p>
              <p><strong>Due Days:</strong> {overlayData.due_days}</p>
              <p><strong>Edition:</strong> {overlayData.edition}</p>
              <p><strong>Fine Amount:</strong> {overlayData.fine_amount}</p>
              <p><strong>Returned:</strong> {overlayData.returned ? "Yes" : "No"}</p>
              <p><strong>Status:</strong> {overlayData.status}</p>
            </div>
            <button onClick={closeViewOverlay}>Close</button>
          </div>
        </div>
      )}

      {/* Borrow overlay */}
      {borrowOverlayVisible && borrowBook && (
        <BorrowOverlay
          book={borrowBook}
          onClose={() => {
            setBorrowOverlayVisible(false);
            setBorrowBook(null);
          }}
          onBorrowSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
}
