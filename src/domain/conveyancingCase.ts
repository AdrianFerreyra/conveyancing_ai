export type CaseStatus = 'in_progress' | 'completed' | 'on_hold' | 'cancelled'

export type CaseStage =
  | 'instruction'
  | 'pre_contract'
  | 'pre_exchange'
  | 'exchange'
  | 'pre_completion'
  | 'completion'
  | 'post_completion'

export interface PropertyAddress {
  line_1: string
  line_2: string
  city: string
  county: string
  postcode: string
}

export interface Property {
  address: PropertyAddress
  type: string
  tenure: string
  bedrooms: number
  price: number
  epc_rating: string
  council_tax_band: string
  title_number: string
}

export interface Buyer {
  id: string
  name: string
  email: string
  phone: string
  type: string
}

export interface SellerSolicitor {
  firm: string
  contact: string
  email: string
  phone: string
  reference: string
}

export interface Seller {
  id: string
  name: string
  solicitor: SellerSolicitor
}

export interface BuyerConveyancer {
  id: string
  firm: string
  handler: string
  email: string
  phone: string
  reference: string
}

export interface MortgageLender {
  id: string
  name: string
  account_reference: string
  offer_amount: number
  offer_expiry: string
}

export interface EstateAgent {
  id: string
  firm: string
  contact: string
  phone: string
  email: string
}

export interface Parties {
  buyer: Buyer
  seller: Seller
  buyer_conveyancer: BuyerConveyancer
  mortgage_lender: MortgageLender
  estate_agent: EstateAgent
}

export interface Financials {
  purchase_price: number
  mortgage_amount: number
  deposit: number
  stamp_duty: number
  legal_fees_estimate: number
  search_fees_estimate: number
  land_registry_fee: number
  total_estimated_cost: number
}

export interface ConveyancingCase {
  id: string
  reference: string
  type: string
  status: CaseStatus
  created_at: string
  target_completion_date: string
  estimated_exchange_date: string
  current_stage: CaseStage
  priority: string
  property: Property
  parties: Parties
  financials: Financials
}
