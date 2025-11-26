export class Type {
    id?: number;
    libelle: string;

    constructor(data?: Partial<Type>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
