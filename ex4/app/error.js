'use client';

export default function Error({ error, reset }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
                Coś poszło nie tak!
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Spróbuj ponownie
            </button>
        </div>
    );
}