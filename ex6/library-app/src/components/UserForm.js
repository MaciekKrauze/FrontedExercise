import { useState } from 'react';

export default function UserForm({ onAddUser }) {
    const [formData, setFormData] = useState({
        name: '',  // ZMIANA: jedno pole zamiast firstName i lastName
        email: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // POPRAWKA: Prawidłowe usuwanie błędu
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Please enter a name';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter an email';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Email must contain @';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // POPRAWKA: Sprawdzenie czy użytkownik został dodany
        const success = onAddUser(formData);

        // Wyczyść formularz tylko jeśli się udało
        if (success !== false) {  // onAddUser zwraca false gdy email istnieje
            setFormData({
                name: '',
                email: ''
            });
            setErrors({});
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name}</p>)}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email"
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
            </div>

            <button type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Add User
            </button>
        </form>
    );
}