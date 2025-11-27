import { Address } from './adresse.entity'

describe('Adresse (Entité)', () => {

    it('Devrait créer une adresse vide sans données fournies', () => {
        const adresse = new Address()


        expect(adresse.id).toBeUndefined();
        expect(adresse.rue).toBeUndefined();
        expect(adresse.numero).toBeUndefined();
        expect(adresse.complement).toBeUndefined();
        expect(adresse.villeId).toBeUndefined();

    });

    it('Devrait créer une adresse remplie', () => {
        const data = {
            id: 1,
            rue: 'Rue de la Paix',
            numero: '10',
            complement: 'Appartement 5',
            villeId: 2
        }
        const adresse = new Address(data)


        expect(adresse.id).toBe(1);
        expect(adresse.rue).toBe('Rue de la Paix');
        expect(adresse.numero).toBe('10');
        expect(adresse.complement).toBe('Appartement 5');
        expect(adresse.villeId).toBe(2);

    });

    it('Devrait créer une adresse partiellement remplie de données', () => {
        const data = {
            id: 1,

            villeId: 2
        }
        const adresse = new Address(data)


        expect(adresse.id).toBe(1);
        expect(adresse.rue).toBeUndefined();
        expect(adresse.numero).toBeUndefined();
        expect(adresse.complement).toBeUndefined();
        expect(adresse.villeId).toBe(2);

    });

});