import { useState } from 'react';

export default function BookList({ books, onDeleteBook }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (books.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">No books found. Add a first one!</div>
        );
    }
    return (
        <div>
            <div className="mb-4">
                <input type="text" placeholder="Search by title or author" value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredBooks.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No books found.</div>
                ) : (
                    filteredBooks.map(book => (
                        <div key={book.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">{book.title}</h3>
                                    <p className="text-gray-600 text-sm">Author: {book.author}</p>
                                    <p className="text-gray-600 text-sm">Genre: {book.genre}</p>
                                    <p className="text-gray-600 text-sm">ISBN: {book.isbn}</p>
                                    <div className="mt-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                book.available > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            Available: {book.available} of {book.total}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => onDeleteBook(book.id)}
                                    className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}