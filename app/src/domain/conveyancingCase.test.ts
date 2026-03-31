import type { ConveyancingCase, CaseStatus, CaseStage } from './conveyancingCase'

const sampleCase: ConveyancingCase = {
  id: 'CASE-2024-0847',
  reference: 'JW/PROP/2024/0847',
  type: 'purchase',
  status: 'in_progress',
  created_at: '2024-09-12T09:15:00Z',
  target_completion_date: '2025-01-10T00:00:00Z',
  estimated_exchange_date: '2024-12-20T00:00:00Z',
  current_stage: 'pre_exchange',
  priority: 'normal',
  property: {
    address: {
      line_1: '42 Willowmere Drive',
      line_2: '',
      city: 'Bristol',
      county: 'Avon',
      postcode: 'BS9 3EF',
    },
    type: 'semi_detached',
    tenure: 'freehold',
    bedrooms: 3,
    price: 425000,
    epc_rating: 'C',
    council_tax_band: 'D',
    title_number: 'AV123456',
  },
  parties: {
    buyer: {
      id: 'PARTY-001',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '07700 900123',
      type: 'individual',
    },
    seller: {
      id: 'PARTY-002',
      name: 'James and Linda Hargreaves',
      solicitor: {
        firm: 'Blackwood & Associates',
        contact: 'Helen Yates',
        email: 'h.yates@blackwood-law.co.uk',
        phone: '0117 496 0022',
        reference: 'HY/HARG/2024/312',
      },
    },
    buyer_conveyancer: {
      id: 'PARTY-003',
      firm: 'Our Firm LLP',
      handler: 'David Chen',
      email: 'd.chen@ourfirm.co.uk',
      phone: '0117 300 4500',
      reference: 'DC/MITCH/2024/0847',
    },
    mortgage_lender: {
      id: 'PARTY-004',
      name: 'Nationwide Building Society',
      account_reference: 'NW-MORT-2024-88431',
      offer_amount: 340000,
      offer_expiry: '2025-03-12T00:00:00Z',
    },
    estate_agent: {
      id: 'PARTY-005',
      firm: 'Savills Bristol',
      contact: 'Tom Radcliffe',
      phone: '0117 933 5800',
      email: 't.radcliffe@savills.com',
    },
  },
  financials: {
    purchase_price: 425000,
    mortgage_amount: 340000,
    deposit: 85000,
    stamp_duty: 11250,
    legal_fees_estimate: 1850,
    search_fees_estimate: 350,
    land_registry_fee: 270,
    total_estimated_cost: 438720,
  },
}

describe('ConveyancingCase domain model', () => {
  it('accepts a fully populated case', () => {
    expect(sampleCase.id).toBe('CASE-2024-0847')
    expect(sampleCase.status).toBe('in_progress')
    expect(sampleCase.current_stage).toBe('pre_exchange')
  })

  it('carries nested property address', () => {
    expect(sampleCase.property.address.line_1).toBe('42 Willowmere Drive')
    expect(sampleCase.property.address.city).toBe('Bristol')
    expect(sampleCase.property.price).toBe(425000)
  })

  it('carries all party types', () => {
    expect(sampleCase.parties.buyer.name).toBe('Sarah Mitchell')
    expect(sampleCase.parties.seller.solicitor.firm).toBe('Blackwood & Associates')
    expect(sampleCase.parties.buyer_conveyancer.handler).toBe('David Chen')
    expect(sampleCase.parties.mortgage_lender.offer_amount).toBe(340000)
    expect(sampleCase.parties.estate_agent.firm).toBe('Savills Bristol')
  })

  it('carries financials', () => {
    expect(sampleCase.financials.deposit).toBe(85000)
    expect(sampleCase.financials.total_estimated_cost).toBe(438720)
  })

  it('covers all valid CaseStatus values', () => {
    const statuses: CaseStatus[] = ['in_progress', 'completed', 'on_hold', 'cancelled']
    expect(statuses).toHaveLength(4)
  })

  it('covers all valid CaseStage values', () => {
    const stages: CaseStage[] = [
      'instruction',
      'pre_contract',
      'pre_exchange',
      'exchange',
      'pre_completion',
      'completion',
      'post_completion',
    ]
    expect(stages).toHaveLength(7)
  })
})
