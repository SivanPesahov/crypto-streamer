type FavoriteButtonProps = {
  coinId: string;
  isFavorite: boolean;
  toggleFavorite: (formData: FormData) => Promise<void>;
};

export function FavoriteButton({
  coinId,
  isFavorite,
  toggleFavorite,
}: FavoriteButtonProps) {
  return (
    <form action={toggleFavorite}>
      <input type="hidden" name="coinId" value={coinId} />
      <input
        type="hidden"
        name="action"
        value={isFavorite ? "remove" : "add"}
      />
      <button
        type="submit"
        aria-label="Toggle favorite"
        className="rounded-full p-2 hover:bg-neutral-700/60 transition"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <span
          className={`${
            isFavorite ? "text-yellow-400" : "text-neutral-500"
          } text-lg leading-none`}
        >
          {isFavorite ? "★" : "☆"}
        </span>
      </button>
    </form>
  );
}
