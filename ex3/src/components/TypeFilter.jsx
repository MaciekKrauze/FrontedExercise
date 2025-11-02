import { getTypeColor } from '../utils/typeColors';

export default function TypeFilter({ type, isSelected, onToggle }) {
    return (
        <button
            onClick={() => onToggle(type)}
            className={`px-3 py-1 rounded-full text-white text-sm font-semibold transition ${
                getTypeColor(type)
            } ${
                isSelected
                    ? 'ring-4 ring-offset-2 ring-blue-400'
                    : 'opacity-60 hover:opacity-100'
            }`}
        >
            {type}
        </button>
    );
}