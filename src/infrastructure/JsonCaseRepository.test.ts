import { JsonCaseRepository } from './JsonCaseRepository'
import type { ConveyancingCase } from '../domain/conveyancingCase'

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

describe('JsonCaseRepository', () => {
  it('returns the case for the correct case ID', async () => {
    const repo = new JsonCaseRepository(sampleCase)
    const result = await repo.getCaseById('CASE-2024-0847')

    expect(result).not.toBeNull()
    expect(result?.id).toBe('CASE-2024-0847')
  })

  it('returns null for an unknown case ID', async () => {
    const repo = new JsonCaseRepository(sampleCase)
    const result = await repo.getCaseById('CASE-9999-0000')

    expect(result).toBeNull()
  })

  it('maps all top-level fields correctly', async () => {
    const repo = new JsonCaseRepository(sampleCase)
    const result = await repo.getCaseById('CASE-2024-0847')

    expect(result?.status).toBe('in_progress')
    expect(result?.current_stage).toBe('pre_exchange')
    expect(result?.reference).toBe('JW/PROP/2024/0847')
  })

  it('maps nested property address correctly', async () => {
    const repo = new JsonCaseRepository(sampleCase)
    const result = await repo.getCaseById('CASE-2024-0847')

    expect(result?.property.address.line_1).toBe('42 Willowmere Drive')
    expect(result?.property.address.city).toBe('Bristol')
    expect(result?.property.price).toBe(425000)
  })

  it('maps parties correctly', async () => {
    const repo = new JsonCaseRepository(sampleCase)
    const result = await repo.getCaseById('CASE-2024-0847')

    expect(result?.parties.buyer.name).toBe('Sarah Mitchell')
    expect(result?.parties.buyer_conveyancer.handler).toBe('David Chen')
    expect(result?.parties.mortgage_lender.offer_amount).toBe(340000)
  })
})
