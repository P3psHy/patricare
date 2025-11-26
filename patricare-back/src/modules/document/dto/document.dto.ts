export class DocumentDto {
  id: number;
  nom: string;
  type: string;
  dateModification: string;

  // Relation Document <-> Logement via Rerelier
  lodging: {
    id: number;
    estLoue: boolean;
    prixLoyer: number;
    superficie: number;
    nbPiece: number;
  }[];

  // Relation Document <-> User via Relier
  user: {
    id: number;
    firstname: string;
    lastname: string;
    telephone: string;
    mail: string;
    password: string;
  }[];
}
