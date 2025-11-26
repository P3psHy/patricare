import { Role } from './role.entity';

describe('Role (Entité)', () => {

  // Test : création d'un rôle vide sans passer de données
  it('devrait créer un Role vide si aucune donnée n’est fournie', () => {
    const role = new Role();

    // id doit être undefined
    expect(role.id).toBeUndefined();

    // libelle doit être undefined
    expect(role.libelle).toBeUndefined();
  });

  // Test : création avec toutes les données
  it('devrait correctement assigner les données fournies', () => {
    // Données simulées
    const data = { id: 1, libelle: 'Administrateur' };

    // Création d’un rôle avec des données
    const role = new Role(data);

    // Vérification de l’assignation des propriétés
    expect(role.id).toBe(1);
    expect(role.libelle).toBe('Administrateur');
  });

  // Test : création avec seulement une partie des propriétés
  it('devrait accepter des données partielles', () => {
    const data = { libelle: 'Utilisateur' };

    const role = new Role(data);

    // id n’a pas été fourni : il doit rester undefined
    expect(role.id).toBeUndefined();

    // libelle doit être assigné
    expect(role.libelle).toBe('Utilisateur');
  });
});
