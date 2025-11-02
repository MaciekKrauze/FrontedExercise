import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata = {
    title: 'GameDex Next.js',
    description: 'Biblioteka Pokemonów z Next.js',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pl">
        <body className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}