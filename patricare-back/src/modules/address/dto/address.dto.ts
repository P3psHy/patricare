// dto/lodging.dto.ts
export class AddressDto {
  id: number;
  rue: string;

  // Relation Ville <-> Adresse via Associer
  city: {
    id: number;
    nom: string;
    codePostal: string;
    departement: string;
    region: string;
  }[];
}
