type FilterButtonProps = {
  label: string;
  filterValue: string | null;
  currentFilter: string | null;
  onClick: () => void;
  colorClass: string;
};

export function FilterButton({
  label,
  filterValue,
  currentFilter,
  onClick,
  colorClass,
}: FilterButtonProps) {
  const isActive = currentFilter === filterValue;
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out shadow-sm ${
        isActive
          ? `${colorClass} bg-blue-100  border border-blue-300`
          : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
      }`}
    >
      <span className="flex items-center gap-1">
        {filterValue === "risers" && <span>↑</span>}
        {filterValue === "fallers" && <span>↓</span>}
        {label}
      </span>
    </button>
  );
}
