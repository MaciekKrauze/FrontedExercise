export default function ErrorMessage({ message }) {
    return (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fadeIn">
            {message}
        </div>
    );
}