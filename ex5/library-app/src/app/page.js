'use client';
import { useState } from 'react';
import BookForm from "@/components/BookForm";

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

  return (
      <>
        <BookForm onAddBook={(book) => setBooks([...books, book])} />
      </>
  )
}
