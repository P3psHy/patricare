export class Ville {
    id?: number;
    nom: string;
    codePostal: string;
    departement?: string;
    region?: string;

    constructor(data?: Partial<Ville>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
