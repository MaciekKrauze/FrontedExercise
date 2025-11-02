import { useState } from 'react';

export const UserList = ({ users, loans, onDeleteUser }) => {
    const getUserLoansCount = (userId) => {
        return loans.filter(loan => loan.userId === userId).length;
    };
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUser = users.filter((user) => {
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    })
    if (users.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No user found. Add a first one!
            </div>
        )
    }
    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map(user => {
                const loansCount = getUserLoansCount(user.id);
                const hasLoans = loansCount > 0;

                return (
                    <div key={user.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                                <p className="text-black-600 text-sm">Email: {user.email}</p>
                                <div className="mt-2">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            hasLoans ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                        Active loans : {loansCount}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => onDeleteUser(user.id)} disabled={hasLoans}
                                className={`ml-4 px-3 py-1 rounded-md text-sm transition-colors ${
                                    hasLoans
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                                title={hasLoans ? 'Nie można usunąć użytkownika z aktywnymi wypożyczeniami' : 'Usuń użytkownika'}>
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}