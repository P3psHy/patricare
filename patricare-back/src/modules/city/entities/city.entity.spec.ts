import { City } from './city.entity';

describe('City Entity', () => {
  it('The CP must have 5 caracter.', () => {
    const city = new City({
      nom: 'Paris',
      codePostal: '75001',
      departement: '75',
      region: 'Île-de-France',
    });
    expect(city.codePostal.length).toBeLessThan(6);
    expect(city.codePostal.length).toBeGreaterThan(4);
  });
});
