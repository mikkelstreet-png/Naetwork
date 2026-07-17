import { CONTRIBUTION_PERCENT } from './platform'

export function sessionImpactAmount(price: number) {
  return Math.round(price * CONTRIBUTION_PERCENT / 100)
}

