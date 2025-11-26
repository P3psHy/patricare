export class Adresse {
  id?: number;
  rue: string;
  numero?: string;
  complement?: string;
  villeId?: number;

  constructor(data?: Partial<Adresse>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
