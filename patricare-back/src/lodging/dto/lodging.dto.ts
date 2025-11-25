export class LodgingDto {
  id!: number;
  estLoue!: boolean;
  prixLoyer!: number;
  superficie!: number;
  nbPiece!: number;
  adresseId!: number;
  ownerId!: number;
  tenantId?: number;
}
