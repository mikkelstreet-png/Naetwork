import { NextResponse } from 'next/server'

export function GET() {
  const body = [
    'Contact: mailto:kontakt@naetwork.dk',
    'Preferred-Languages: da, en',
    'Canonical: https://naetwork.dk/.well-known/security.txt',
    'Policy: https://naetwork.dk/privacy',
    'Expires: 2027-07-07T00:00:00.000Z',
  ].join('\n')

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
