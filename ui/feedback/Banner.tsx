export default function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-3 text-sm bg-gray-50">
      {children}
    </div>
  );
}


