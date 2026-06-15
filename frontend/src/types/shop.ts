export interface Shop {
  id: number;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  lat: number;
  lng: number;
  qvikVerified: boolean;
  sponsored: boolean;
  sponsorTier: number;
  website: string | null;
}
