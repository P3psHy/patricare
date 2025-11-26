import { User } from './user.entity';

describe('User (Entité)', () => {

    it ('devrait créer un User vide si aucune donnée n’est fournie', () => {
        const user = new User();

        expect(user.id).toBeUndefined();
        expect(user.firstname).toBeUndefined();
        expect(user.lastname).toBeUndefined();
        expect(user.email).toBeUndefined();
        expect(user.password).toBeUndefined();
        expect(user.roleId).toBeUndefined();
        expect(user.createdAt).toBeUndefined();
    });

    it ('devrait créer un User avec toutes ses données', () => {
        const data = {
            id: 1,
            firstname: 'Michel',
            lastname: 'Berger',
            email: 'michel.berger@gmail.com',
            password: 'test1234',
            roleId: 1,
            createdAt: new Date('2025-01-01T00:00:00Z')

        }
        const user = new User(data);

        expect(user.id).toBe(1);
        expect(user.firstname).toBe('Michel');
        expect(user.lastname).toBe('Berger')
        expect(user.email).toBe('michel.berger@gmail.com');
        expect(user.password).toBe('test1234');
        expect(user.roleId).toBe(1);
        expect(user.createdAt).toEqual(new Date('2025-01-01T00:00:00Z'));
    });

    it ('devrait créer un User avec des données partiels', () => {
        const data = {
            id: 1,
            firstname: 'Michel',
            lastname: 'Berger',
        }
        const user = new User(data);

        expect(user.id).toBe(1);
        expect(user.firstname).toBe('Michel');
        expect(user.lastname).toBe('Berger');
        expect(user.email).toBeUndefined();
        expect(user.password).toBeUndefined();
        expect(user.roleId).toBeUndefined();
        expect(user.createdAt).toBeUndefined();
    });

});