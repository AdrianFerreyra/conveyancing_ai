import type { ConveyancingCase } from '../../src/domain/conveyancingCase'

interface Props {
  conveyancingCase: ConveyancingCase
}

/* SVG icon helpers */
const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)
const IconPound = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.5 8.5A2.5 2.5 0 0 1 14 10c0 3-4 3-4 6h5" />
    <line x1="8" y1="16" x2="16" y2="16" />
  </svg>
)
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconBriefcase = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconBank = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" /><line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" /><line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
  </svg>
)

function formatPrice(n: number): string {
  return '£' + n.toLocaleString('en-GB')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function avatarInitials(line1: string): string {
  return line1.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function CaseCard({ conveyancingCase: c }: Props) {
  const { property, parties, financials } = c
  const addr = property.address

  return (
    <div className="case-card">
      <div className="case-card-header">
        <div className="case-card-avatar">{avatarInitials(addr.line_1)}</div>
        <div className="case-card-title">{addr.line_1}</div>
      </div>
      <hr className="case-card-divider" />
      <div className="case-card-fields">
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconGlobe /></span>
          <span className="case-card-field-label">Location</span>
          <span className="case-card-field-value">{addr.city}, {addr.postcode}</span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconTag /></span>
          <span className="case-card-field-label">Status</span>
          <span className="case-card-field-value">
            <span className="badge badge--blue">{c.status}</span>
          </span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconTag /></span>
          <span className="case-card-field-label">Stage</span>
          <span className="case-card-field-value">
            <span className="badge badge--purple">{c.current_stage}</span>
          </span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconPound /></span>
          <span className="case-card-field-label">Purchase price</span>
          <span className="case-card-field-value">{formatPrice(financials.purchase_price)}</span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconUser /></span>
          <span className="case-card-field-label">Buyer</span>
          <span className="case-card-field-value">{parties.buyer.name}</span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconBriefcase /></span>
          <span className="case-card-field-label">Conveyancer</span>
          <span className="case-card-field-value">{parties.buyer_conveyancer.handler}</span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconCalendar /></span>
          <span className="case-card-field-label">Target completion</span>
          <span className="case-card-field-value">{formatDate(c.target_completion_date)}</span>
        </div>
        <div className="case-card-field">
          <span className="case-card-field-icon"><IconBank /></span>
          <span className="case-card-field-label">Mortgage</span>
          <span className="case-card-field-value">
            {parties.mortgage_lender.name} · {formatPrice(financials.mortgage_amount)}
          </span>
        </div>
      </div>
    </div>
  )
}
