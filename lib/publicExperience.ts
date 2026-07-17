import { sessionEconomics } from './platform'

export function sessionImpactAmount(price: number) {
  return sessionEconomics(price).contribution
}
