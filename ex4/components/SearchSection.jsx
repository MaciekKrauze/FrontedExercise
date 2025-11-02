import TypeFilter from './TypeFilter';

export default function SearchSection({ selectedTypes, allTypes }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="font-bold text-gray-700 mb-3">Dostępne typy:</h3>
            <div className="flex flex-wrap gap-2">
                {allTypes.map(type => (
                    <TypeFilter
                        key={type}
                        type={type}
                        isSelected={selectedTypes?.includes(type)}
                    />
                ))}
            </div>
        </div>
    );
}