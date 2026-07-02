export type Federation = {
  id: string;
  name: string;
  website: string | null;
};

export type Championship = {
  id: string;
  name: string;
  federationId: string;
  federation: Federation;
  date: string;
  state: string;
  city: string;
  venue: string | null;
  latitude: number;
  longitude: number;
  sourceUrl: string | null;
};
