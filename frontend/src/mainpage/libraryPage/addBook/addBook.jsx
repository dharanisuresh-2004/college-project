import React, { useState } from "react";
import "./addBook.css";

export default function AddBook() {
  const [book, setBook] = useState({
    author: "",
    book_name: "",
    description: "",
    edition: "",
    checkin_date: "", // optional
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({
      ...book,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/addBooks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
      if (!res.ok) throw new Error("Failed to add book");
      await res.json();
      setMessage("Book added successfully!");
      setBook({
        author: "",
        book_name: "",
        description: "",
        edition: "",
        checkin_date: "",
      });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="add-book-page">
      <h1>Add New Book</h1>
      <form className="add-book-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="book_name"
          placeholder="Book Name"
          value={book.book_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={book.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="edition"
          placeholder="Edition"
          value={book.edition}
          onChange={handleChange}
        />
        <input
          type="date"
          name="checkin_date"
          value={book.checkin_date}
          onChange={handleChange}
        />

        <button type="submit">Add Book</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
