export const SHIPMENT_TYPES = [
  'Documents',
  'Parcel',
  'Freight',
  'Palletized',
  'Express',
  'Hazardous',
] as const

export const PIECE_TYPES = ['Crate', 'Carton', 'Box'] as const

export const PAYMENT_MODES = ['Prepaid', 'COD', 'Credit', 'Invoice'] as const

export const PRODUCT_TYPES = [
  'Electronics',
  'Apparel',
  'Machinery',
  'Food & Beverage',
  'Pharmaceuticals',
  'General cargo',
] as const

export const WEIGHT_PRESETS_KG = [1, 5, 10, 25, 50, 100, 250, 500, 1000] as const
