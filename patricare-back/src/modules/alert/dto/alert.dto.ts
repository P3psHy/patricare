export class AlertDto {
  id: number;
  titre: string;
  commentaire: string;

  user: {
    id: number;
    estLoue: boolean;
    prixLoyer: number;
    superficie: number;
    nbPiece: number;
  };
  alert_type: {
    id: number;
    nom: string;
  };
}
