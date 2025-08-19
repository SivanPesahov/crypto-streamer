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
      className={`px-4 py-2 rounded ${
        isActive
          ? `${colorClass} font-semibold`
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {label}
    </button>
  );
}
