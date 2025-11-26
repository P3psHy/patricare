export class UserDto {
  id: number;
  firstname: string;
  lastname: string;
  telephone: string;
  mail: string;
  password: string;

  user: {
    id: number;
    estLoue: boolean;
    prixLoyer: number;
    superficie: number;
    nbPiece: number;
  };
  role: {
    id: number;
    role: string;
  };
}