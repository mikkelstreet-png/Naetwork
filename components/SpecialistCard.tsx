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

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white p-6 flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-[16px] text-[#0a0a0a]">{specialist.name}</h3>
        <p className="text-[14px] text-[#6b7280] mt-0.5">{specialist.role_title}</p>
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#0a0a0a]">AI-speciale</p>
        <p className="text-[14px] text-[#374151] mt-0.5">{specialist.ai_specialty}</p>
      </div>
      {specialist.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specialist.categories.map((cat) => (
            <span key={cat} className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[12px] text-[#374151]">
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
        <p className="text-[14px] text-[#374151] leading-relaxed border-t border-[#e5e5e5] pt-4">
          {specialist.short_bio}
        </p>
      )}
      <div className="flex flex-wrap gap-3 mt-auto pt-2">
        <a
          href={`mailto:${specialist.email}`}
          className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#333] transition-colors"
        >
          Kontakt direkte
        </a>
        {specialist.linkedin_or_website && (
          <a
            href={specialist.linkedin_or_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-[#e5e5e5] px-4 py-2 text-[13px] font-medium text-[#0a0a0a] hover:bg-[#f9f9f9] transition-colors"
          >
            Profil
          </a>
        )}
      </div>
    </div>
  );
}
