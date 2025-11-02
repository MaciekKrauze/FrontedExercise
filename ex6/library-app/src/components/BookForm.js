import { useState } from 'react';

export default function BookForm({ onAddBook }) {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',  // zmienione z ISBN na isbn (małe litery)
        genre: '',
        total: ''  // zmienione z amount na total
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // POPRAWKA: Usuwanie błędu dla danego pola
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Please enter a title';
        }
        if (!formData.author.trim()) {
            newErrors.author = 'Please enter an author';
        }
        if (!formData.genre.trim()) {
            newErrors.genre = 'Please enter a genre';
        }
        if (!formData.total || formData.total <= 0) {
            newErrors.total = 'Please enter amount';
        }
        if (!formData.isbn.trim()) {
            newErrors.isbn = 'Please enter an ISBN';
        } else if (formData.isbn.length !== 13) {  // POPRAWKA: else if zamiast osobnego if
            newErrors.isbn = 'ISBN must be 13 characters';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();

        // POPRAWKA: Sprawdzenie czy są błędy
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;  // Zatrzymaj jeśli są błędy
        }

        // Dodaj książkę
        onAddBook({
            ...formData,
            total: parseInt(formData.total),
        });

        // Wyczyść formularz
        setFormData({
            title: '',
            author: '',
            isbn: '',
            genre: '',
            total: ''
        });
        setErrors({});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                </label>
                <input
                    name="title"  // POPRAWKA: Dodane name
                    value={formData.title}  // POPRAWKA: Dodane value
                    onChange={handleChange}  // POPRAWKA: Dodane onChange
                    type="text"
                    placeholder="Enter book title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                </label>
                <input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter author name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.author && (
                    <p className="text-red-500 text-sm mt-1">{errors.author}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN (13 characters)
                </label>
                <input
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    type="text"
                    maxLength="13"
                    placeholder="1234567890123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.isbn && (
                    <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                </label>
                <input
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. Fantasy, Crime"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.genre && (
                    <p className="text-red-500 text-sm mt-1">{errors.genre}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of copies
                </label>
                <input
                    name="total"
                    value={formData.total}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.total && (
                    <p className="text-red-500 text-sm mt-1">{errors.total}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                Add Book
            </button>
        </form>
    );
}