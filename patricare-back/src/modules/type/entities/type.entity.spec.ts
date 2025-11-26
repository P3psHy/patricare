import { Type } from './type.entity';

describe('Type (Entité)', () => {
    
it("Devrait créer un Type vide si aucune donnée n'est fournie", () => {
    const type = new Type();

    expect(type.id).toBeUndefined();
    expect(type.libelle).toBeUndefined();
})

it("Devrait créer un Type avec toutes les données assignées", () => {
    const data = { id: 1, libelle: 'Inondation' };
    const type = new Type(data);

    expect(type.id).toBe(1);
    expect(type.libelle).toBe("Inondation");
})

it("Devrait créer un Type partiellement rempli", () => {
    const data = { libelle: 'Inondation' };
    const type = new Type(data);

    expect(type.id).toBeUndefined();
    expect(type.libelle).toBe("Inondation");
})

});