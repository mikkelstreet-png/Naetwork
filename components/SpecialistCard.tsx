type Specialist = {
  id: string;
  name: string;
  role_title: string;
  ai_specialty: string;
  categories: string[];
  typical_project_size: string;
  availability: string;
  short_bio: string;
  email: string;
  linkedin_or_website: string | null;
};

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

function availabilityBadgeClass(availability: string): string {
  if (availability?.toLowerCase().includes('tilgængelig nu') || availability?.toLowerCase().includes('available now')) {
    return 'bg-green-50 text-green-800';
  }
  return 'bg-gray-100 text-gray-600';
}

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col gap-5">
      {/* Top: role + availability */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <UserIcon />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500">{specialist.role_title}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${availabilityBadgeClass(specialist.availability)}`}>
          {specialist.availability}
        </span>
      </div>

      {/* Name + bio */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{specialist.name}</h3>
        {specialist.short_bio && (
          <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{specialist.short_bio}</p>
        )}
      </div>

      {/* Category pills */}
      {specialist.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specialist.categories.slice(0, 4).map((cat) => (
            <span key={cat} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cat}
            </span>
          ))}
          {specialist.categories.length > 4 && (
            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
              +{specialist.categories.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Budget */}
      {specialist.typical_project_size && (
        <div className="text-sm text-gray-400">
          <span className="font-medium text-gray-600">{specialist.typical_project_size}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50 mt-auto">
        <a
          href={`mailto:${specialist.email}`}
          className="bg-green-800 text-white hover:bg-green-900 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        >
          Kontakt direkte
        </a>
        {specialist.linkedin_or_website && (
          <a
            href={specialist.linkedin_or_website}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
          >
            Profil
          </a>
        )}
      </div>
    </div>
  );
}
