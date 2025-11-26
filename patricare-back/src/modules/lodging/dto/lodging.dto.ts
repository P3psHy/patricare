// dto/lodging.dto.ts
export class LodgingDto {
  id: number;
  estLoue: boolean;
  prixLoyer: number;
  superficie: number;
  nbPiece: number;

  // Relation avec Adresse
  adresseId: number;

  // Relation User <-> Logement via Loger
  users: {
    userId: number;
    statut: string;
  }[];
}
