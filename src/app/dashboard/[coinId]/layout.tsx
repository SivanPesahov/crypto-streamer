export default function CoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-neutral-900 text-neutral-100 min-h-screen">
      {children}
    </div>
  );
}
