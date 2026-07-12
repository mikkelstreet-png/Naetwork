import { ImageResponse } from 'next/og';

export const alt = 'Naetwork - Karrieresparring med mening';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ffffff', color: '#050505', padding: '68px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: 28, fontWeight: 800 }}>
        <div style={{ width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#ffffff', borderRadius: 8, fontSize: 20 }}>N</div>
        Naetwork
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ maxWidth: 970, fontSize: 78, lineHeight: 0.98, fontWeight: 800, letterSpacing: 0 }}>Karrieresparring med mening.</div>
        <div style={{ fontSize: 25, color: '#52525b' }}>60 minutter. Tydelig pris. Minimum 40% af prisen ekskl. moms afsættes til kræftsagen efter en betalt session.</div>
      </div>
      <div style={{ display: 'flex', width: '100%', height: 14, overflow: 'hidden', borderRadius: 7 }}>
        <div style={{ flex: 1, background: '#67e8f9' }} />
        <div style={{ flex: 1, background: '#6ee7b7' }} />
        <div style={{ flex: 1, background: '#93c5fd' }} />
        <div style={{ flex: 1, background: '#bef264' }} />
      </div>
    </div>,
    size,
  );
}
