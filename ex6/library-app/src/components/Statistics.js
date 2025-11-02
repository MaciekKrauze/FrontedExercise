export default function Statistics({ books, users, loans }) {
    const totalBooks = books.reduce((sum, book) => sum + book.total, 0);
    const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
    const borrowedBooks = totalBooks - availableBooks;

    const stats = [
        {
            label: 'All books',
            value: totalBooks,
            color: 'bg-blue-500',
        },
        {
            label: 'Available books',
            value: availableBooks,
            color: 'bg-green-500',
        },
        {
            label: 'Borrowed books',
            value: borrowedBooks,
            color: 'bg-orange-500',
        },
        {
            label: 'Users',
            value: users.length,
            color: 'bg-purple-500',
        },
        {
            label: 'Active loans',
            value: loans.length,
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className={`${stat.color} text-white rounded-lg shadow-lg p-6 text-center`}>
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}