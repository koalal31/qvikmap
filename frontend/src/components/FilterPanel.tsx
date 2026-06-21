export interface Filters {
  city: string;
  type: string;
}

const SHOP_TYPES = ['BAKERY', 'RESTAURANT', 'CAFE', 'PHARMACY', 'GROCERY'];

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
  onSuggest: () => void;
}

export function FilterPanel({ filters, onChange, resultCount, onSuggest }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">Qvik Map</h1>
        <p className="text-sm text-gray-500">
          {resultCount} shop{resultCount !== 1 ? 's' : ''} found
        </p>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">City</span>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
          placeholder="e.g. Budapest"
          className="rounded border border-gray-300 px-2 py-1"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Type</span>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="rounded border border-gray-300 px-2 py-1"
        >
          <option value="">All types</option>
          {SHOP_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </label>

      {(filters.city || filters.type) && (
        <button
          type="button"
          onClick={() => onChange({ city: '', type: '' })}
          className="self-start text-sm text-blue-600 underline"
        >
          Clear filters
        </button>
      )}

      <hr className="border-gray-200" />

      <button
        type="button"
        onClick={onSuggest}
        className="rounded border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        + Suggest a shop
      </button>
    </div>
  );
}
