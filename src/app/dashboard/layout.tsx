export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 min-h-screen bg-neutral-900 text-white">{children}</div>
  );
}
