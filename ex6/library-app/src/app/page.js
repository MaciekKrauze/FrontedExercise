'use client';
import { useState } from 'react';
import Statistics from '../components/Statistics';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import UserForm from '../components/UserForm';
import {UserList} from '@/components/UserList';
import LoanManager from '../components/LoanManager';
import ToastContainer from "@/components/ToastContainer";

export default function Home() {
  // Stan książek
  const [books, setBooks] = useState([]);
  // Struktura: {id, title, author, isbn, genre, available, total}

  // Stan użytkowników
  const [users, setUsers] = useState([]);
  // Struktura: {id, name, email}

  // Stan wypożyczeń
  const [loans, setLoans] = useState([]);
  // Struktura: {id, bookId, userId, bookTitle, userName, loanDate}

  const [toasts, setToasts] = useState([]);
  // Struktura: { id, message, type, duration }

  // Funkcja do dodawania toastów
  const showToast = (message, type = 'success', duration = 3000) => {
    setToasts(prev => [
      ...prev,
      { id: Date.now(), message, type, duration }
    ]);
  };

// Funkcja do usuwania toastów
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Funkcje zarządzania książkami
  const handleAddBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      available: bookData.total,
    };
    setBooks([...books, newBook]);
    showToast("Book added successfully!", "success");
  };

  const handleDeleteBook = (bookId) => {
    const isLoaned = loans.some(loan => loan.bookId === bookId);
    if (isLoaned) {
      showToast('You cannot delete a book that is on loan!', "error");
      return;
    }
    setBooks(books.filter(book => book.id !== bookId));
  };

  const handleAddUser = (userData) => {
    const emailExists = users.some(user => user.email === userData.email);
    if (emailExists) {
      showToast('A user with this email address already exists!', "error");
      return false;
    }

    const newUser = {
      id: Date.now(),
      ...userData,
    };
    setUsers([...users, newUser]);
    return true;
  };

  const handleDeleteUser = (userId) => {
    const hasLoans = loans.some(loan => loan.userId === userId);
    if (hasLoans) {
      showToast('Cannot delete user with active rentals!', "error");
      return;
    }
    setUsers(users.filter(user => user.id !== userId));
    showToast("Book deleted!", "success");
  };

  const handleBorrowBook = (bookId, userId) => {
    const book = books.find(b => b.id === bookId);
    const user = users.find(u => u.id === userId);

    if (!book || !user) {
      showToast("Incorrect data!", "error");
      return;
    }

    if (book.available <= 0) {
      showToast("No copies available!", "error");
      return;
    }

    const newLoan = {
      id: Date.now(),
      bookId: book.id,
      userId: user.id,
      bookTitle: book.title,
      userName: user.name,
      loanDate: new Date().toLocaleDateString('pl-PL'),
    };

    setBooks(books.map(b =>
        b.id === bookId
            ? { ...b, available: b.available - 1 }
            : b
    ));

    setLoans([...loans, newLoan]);
    showToast("Book borrowed!", "success");
  };

  const handleReturnBook = (loanId) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    setBooks(books.map(b =>
        b.id === loan.bookId
            ? { ...b, available: b.available + 1 }
            : b
    ));
    setLoans(loans.filter(l => l.id !== loanId));
    showToast("Book returned!", "success");
  };

  return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Library Management System</h1>

        <Statistics books={books} users={users} loans={loans}/>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add a Book</h2>
              <BookForm onAddBook={handleAddBook} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Book List</h2>
              <BookList books={books} onDeleteBook={handleDeleteBook}/>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add User</h2>
              <UserForm onAddUser={handleAddUser} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Users list</h2>
              <UserList users={users} loans={loans} onDeleteUser={handleDeleteUser}/>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Borrow Management</h2>
          <LoanManager books={books} users={users} loans={loans} onBorrowBook={handleBorrowBook} onReturnBook={handleReturnBook}/>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </main>
  );
}