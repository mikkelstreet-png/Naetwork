export default function VilkaarPage() {
  return (
    <main className="pt-16 max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vilkaar og betingelser</h1>
      <div className="space-y-4 text-gray-600">
        <p>Ved at bruge Naetwork accepterer du disse vilkaar og betingelser.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">Platformsbidrag</h2>
        <p>Naetwork opkraever 15% i platformsbidrag. Ved donation til Kraeftens Bekaempelse reduceres bidraget til 7,5%.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">Betaling</h2>
        <p>Alle betalinger behandles via Stripe. Pengene overfoeres efter bekraeftet session.</p>
      </div>
    </main>
  );
}
