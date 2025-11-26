export class Document {
  id?: number;
  titre: string;
  cheminFichier: string;
  dateCreation?: Date;
  userId?: number;

  constructor(data?: Partial<Document>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
