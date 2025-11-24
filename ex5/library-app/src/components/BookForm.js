"use client";
import { useState } from "react";

export default function BookForm({ onAddBook }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [ISBN, setISBN] = useState("");
    const [genre, setGenre] = useState("");
    const [amount, setAmount] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !author || !ISBN || !genre || !amount) {
            setError("All fields are required.");
            return;
        }
        if (ISBN.length !== 13) {
            setError("ISBN must be exactly 13 characters.");
            return;
        }
        if (isNaN(amount) || Number(amount) <= 0) {
            setError("Amount must be a positive integer.");
            return;
        }
        const newBook = {
            id: Date.now(),
            title: title,
            author: author,
            isbn: ISBN,
            genre: genre,
            total: Number(amount),
            available: Number(amount),
        };

        onAddBook(newBook);
        setTitle("");
        setAuthor("");
        setISBN("");
        setGenre("");
        setAmount("");
        setError("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add book</h2>
            {error && (<p style={{ color: "red", marginBottom: "10px" }}>{error}</p>)}
            <div>
                <input type="text" id="title_text" placeholder="Title" value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
                <label>Title</label>
            </div>
            <div>
                <input type="text" id="author_text" placeholder="Author" value={author}
                       onChange={(e) => setAuthor(e.target.value)}/>
                <label>Author</label>
            </div>
            <div>
                <input type="text" id="ISBN_text" placeholder="ISBN" value={ISBN}
                       onChange={(e) => setISBN(e.target.value)}/>
                <label>ISBN</label>
            </div>
            <div>
                <input type="text" id="genre_text" placeholder="Genre" value={genre}
                       onChange={(e) => setGenre(e.target.value)}/>
                <label>Genre</label>
            </div>
            <div>
                <input type="number" id="amount_text" placeholder="Amount" value={amount}
                       onChange={(e) => setAmount(e.target.value)}/>
                <label>Amount</label>
            </div>
            <button type="submit">Add book</button>
        </form>
    );
}
