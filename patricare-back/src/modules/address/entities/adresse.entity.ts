export class Address {
  id?: number;
  rue: string;
  numero?: string;
  complement?: string;
  villeId?: number;

  constructor(data?: Partial<Address>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
