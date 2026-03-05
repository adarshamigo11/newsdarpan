export const MP_CITIES = [
  'Indore',
  'Bhopal',
  'Jabalpur',
  'Gwalior',
  'Ujjain',
  'Sagar',
  'Rewa',
  'Satna',
  'Ratlam',
  'Dewas',
] as const

export type MPCity = (typeof MP_CITIES)[number]
