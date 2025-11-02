import { getTypeColor } from '@/utils/typeColors';

export default function TypeFilter({ type, isSelected }) {
    return (
        <span
            className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                getTypeColor(type)
            } ${
                isSelected
                    ? 'ring-4 ring-offset-2 ring-blue-400'
                    : 'opacity-60'
            }`}
        >
      {type}
    </span>
    );
}