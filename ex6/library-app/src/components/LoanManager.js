import { useState } from 'react';

export default function LoanManager({ books, users, loans, onBorrowBook, onReturnBook }) {
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const availableBooks = books.filter(book => book.available > 0);
    const handleBorrow = (e) => {
        e.preventDefault();
        if (!selectedBookId || !selectedUserId) {
            alert('Choose book and user!');
            return;
        }
        onBorrowBook(parseInt(selectedBookId), parseInt(selectedUserId));
        setSelectedBookId('');
        setSelectedUserId('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">New borrows</h3>

                {books.length === 0 || users.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                        {books.length === 0 && users.length === 0 && 'Add books and users to borrow.'}
                        {books.length === 0 && users.length > 0 && 'Add books to borrow.'}
                        {books.length > 0 && users.length === 0 && 'Add users to be able to rent.'}
                    </div>
                ) : availableBooks.length === 0 ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        No active book to borrow
                    </div>
                ) : (
                    <form onSubmit={handleBorrow} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Choose book</label>
                            <select
                                value={selectedBookId}
                                onChange={(e) => setSelectedBookId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">-- Choose book --</option>
                                {availableBooks.map(book => (
                                    <option key={book.id} value={book.id}>{book.title} - {book.author} (accessible: {book.available})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Choose user
                            </label>
                            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="">-- Choose user --</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                            Borrow book
                        </button>
                    </form>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Active borrows</h3>

                {loans.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">No active borrows</div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {loans.map(loan => (
                            <div key={loan.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-orange-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{loan.bookTitle}</h4>
                                        <p className="text-gray-600 text-sm">Users: {loan.userName}</p>
                                        <p className="text-gray-600 text-sm">Borrow date: {loan.loanDate}</p>
                                    </div>
                                    <button onClick={() => onReturnBook(loan.id)}
                                        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
                                        Return
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}