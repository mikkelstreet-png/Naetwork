import { HeartIcon } from './icons/HeartIcon';

interface BookingSummaryProps {
  priceDkk: number;
  donatesToCharity: boolean;
}

export function BookingSummary({ priceDkk, donatesToCharity }: BookingSummaryProps) {
  const commissionPct = donatesToCharity ? 0.075 : 0.15;
  const platformFee = Math.round(priceDkk * commissionPct);
  const payout = priceDkk - platformFee;

  return (
    <div className="border border-gray-100 rounded-2xl p-5 space-y-3">
      <div className="font-semibold text-gray-900 text-sm mb-4">Prisoversigt</div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Sessionspris</span>
        <span className="font-medium text-gray-900">DKK {priceDkk}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Platformsbidrag ({donatesToCharity ? '7,5%' : '15%'})
        </span>
        <span className="font-medium text-gray-900">DKK {platformFee}</span>
      </div>

      {donatesToCharity ? (
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1.5 text-rose-700">
            <HeartIcon className="w-3.5 h-3.5" />
            Til Kraeftens Bekaempelse
          </span>
          <span className="font-medium text-rose-700">DKK {platformFee}</span>
        </div>
      ) : (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Til professionel</span>
          <span className="font-medium text-gray-900">DKK {payout}</span>
        </div>
      )}

      {donatesToCharity && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Til professionel</span>
          <span className="font-medium text-gray-900">DKK {payout}</span>
        </div>
      )}

      <div className="pt-3 border-t border-gray-100">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-semibold text-gray-900">DKK {priceDkk}</span>
        </div>
      </div>

      {donatesToCharity && (
        <div className="flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg px-3 py-2 text-xs">
          <HeartIcon className="w-3.5 h-3.5 flex-shrink-0" />
          Platformsbidraget doneres til Kraeftens Bekaempelse
        </div>
      )}
    </div>
  );
}
