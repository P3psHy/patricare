export class City {
  id?: number;
  nom: string;
  codePostal: string;
  departement?: string;
  region?: string;

  constructor(data?: Partial<City>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
