import React, { useState } from "react";
import "./libraryPage.css"; // CSS file
import BookListPage from "./bookList/bookDetail";
import AddBook from "./addBook/addBook";
import BorrowedBooks from "./borrowReturn/borrowReturn";
import DeleteBook from "./deleteBook/deleteBook"; // Placeholder import

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("Books");

  const renderContent = () => {
    switch (activeTab) {
      case "Books":
        return <div className="tab-content"> <BookListPage/> </div>;
      case "NewBook":
        return <div className="tab-content"> <AddBook/> </div>;
      case "BorrowedBooks":
        return <div className="tab-content"> <BorrowedBooks/> </div>;
      case "DeleteBook":
        return <div className="tab-content"> <DeleteBook/> </div>;
      default:
        return null;
    }
  };

  return (
    <div className="library-page">
      <h1>Library Management</h1>
      <div className="tabs">
        <button
          className={activeTab === "Books" ? "active" : ""}
          onClick={() => setActiveTab("Books")}
        >
          Books
        </button>
        <button
          className={activeTab === "NewBook" ? "active" : ""}
          onClick={() => setActiveTab("NewBook")}
        >
          New Book
        </button>
        <button
          className={activeTab === "BorrowedBooks" ? "active" : ""}
          onClick={() => setActiveTab("BorrowedBooks")}
        >
          Borrowed Books
        </button>
        <button
          className={activeTab === "DeleteBook" ? "active" : ""}
          onClick={() => setActiveTab("DeleteBook")}
        >
          Delete Book
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
