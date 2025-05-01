export interface Address {
  id: number;
  addressLine: string;
  number?: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  additionalInfo?: string;
}