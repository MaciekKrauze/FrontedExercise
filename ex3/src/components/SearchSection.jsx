import TypeFilter from './TypeFilter';

export default function SearchSection({
                                          searchQuery,
                                          allTypes,
                                          selectedTypes,
                                          onSearch,
                                          onTypeToggle
                                      }) {
    return (
        <div className="space-y-4 mb-6">
            <section className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Szukaj po nazwie lub numerze..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </section>

            {allTypes.length > 0 && (
                <section className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold text-gray-700 mb-3">Filtruj po typach:</h3>
                    <div className="flex flex-wrap gap-2">
                        {allTypes.map(type => (
                            <TypeFilter
                                key={type}
                                type={type}
                                isSelected={selectedTypes.includes(type)}
                                onToggle={onTypeToggle}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}