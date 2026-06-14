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

const SPECIALTY_ICONS: Record<string, string> = {
  'Machine Learning': '🤖',
  'Data Analysis': '📊',
  'Automation': '⚙️',
  'NLP': '💬',
  'Computer Vision': '👁️',
  'Generative AI': '✨',
  'Chatbots & NLP': '💬',
  'Data & Analytics': '📊',
  'Generativ AI': '✨',
  'AI-strategi': '🗺️',
  'Andet': '🔧',
};

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const icon = SPECIALTY_ICONS[specialist.ai_specialty] ?? '💡';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-4 hover:border-gray-900 transition-colors">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-[16px] text-[#0a0a0a]">{specialist.name}</h3>
        </div>
        <p className="text-[14px] text-[#6b7280]">{specialist.role_title}</p>
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#0a0a0a]">AI-speciale</p>
        <p className="text-[14px] text-[#374151] mt-0.5">{specialist.ai_specialty}</p>
      </div>
      {specialist.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specialist.categories.map((cat) => (
            <span key={cat} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[12px] text-gray-700">
              {cat}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 text-[13px]">
        <div>
          <p className="text-[#6b7280]">Projektstørrelse</p>
          <p className="font-medium text-[#0a0a0a]">{specialist.typical_project_size}</p>
        </div>
        <div>
          <p className="text-[#6b7280]">Tilgængelighed</p>
          <p className="font-medium text-[#0a0a0a]">{specialist.availability}</p>
        </div>
      </div>
      {specialist.short_bio && (
        <p className="text-[14px] text-[#374151] leading-relaxed border-t border-gray-100 pt-4">
          {specialist.short_bio}
        </p>
      )}
      <div className="flex flex-wrap gap-3 mt-auto pt-2">
        <a
          href={`mailto:${specialist.email}`}
          className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-black transition-colors"
        >
          Kontakt direkte
        </a>
        {specialist.linkedin_or_website && (
          <a
            href={specialist.linkedin_or_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-[13px] font-medium text-[#0a0a0a] hover:border-gray-900 transition-colors"
          >
            Profil
          </a>
        )}
      </div>
    </div>
  );
}
