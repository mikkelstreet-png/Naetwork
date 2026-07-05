export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-5 py-14 sm:px-8" aria-busy="true" aria-label="Indlæser siden">
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="mt-6 h-12 max-w-2xl rounded bg-gray-200 md:h-16" />
        <div className="mt-4 h-5 max-w-xl rounded bg-gray-100" />
        <div className="mt-12 grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-48 bg-[#f7f7f4]" />)}
        </div>
      </div>
    </main>
  );
}
