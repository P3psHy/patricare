export class Lodging {
  id?: number;
  estLoue: boolean = false;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;
  adresseId?: number;
  description?: string;

  constructor(data?: Partial<Lodging>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
