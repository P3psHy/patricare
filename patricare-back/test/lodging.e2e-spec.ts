import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Lodging CRUD (e2e)', () => {
  let app: INestApplication<App>;
  let createdLodgingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /lodgings - should create a new lodging', () => {
    return request(app.getHttpServer())
      .post('/lodgings')
      .send({
        estLoue: false,
        prixLoyer: 1500,
        superficie: 75,
        nbPiece: 3,
        description: 'Test creation',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.prixLoyer).toBe(1500);
        createdLodgingId = res.body.id;
      });
  });

  it('GET /lodgings - should retrieve all lodgings', () => {
    return request(app.getHttpServer())
      .get('/lodgings')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('GET /lodgings/:id - should retrieve a specific lodging', () => {
    return request(app.getHttpServer())
      .get(`/lodgings/${createdLodgingId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(createdLodgingId);
        expect(res.body.prixLoyer).toBe(1500);
      });
  });

  it('PATCH /lodgings/:id - should update a lodging', () => {
    return request(app.getHttpServer())
      .patch(`/lodgings/${createdLodgingId}`)
      .send({ prixLoyer: 1800, estLoue: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.prixLoyer).toBe(1800);
        expect(res.body.estLoue).toBe(true);
      });
  });

  it('DELETE /lodgings/:id - should delete a lodging', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/lodgings')
      .send({
        estLoue: false,
        prixLoyer: 1100,
        superficie: 60,
        nbPiece: 2,
      });

    const lodgingId = createRes.body.id;

    return request(app.getHttpServer())
      .delete(`/lodgings/${lodgingId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });

  it('GET /lodgings/:id - should return empty object for deleted lodging', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/lodgings')
      .send({
        estLoue: false,
        prixLoyer: 1200,
        superficie: 55,
        nbPiece: 2,
      });

    const lodgingId = createRes.body.id;
    await request(app.getHttpServer()).delete(`/lodgings/${lodgingId}`);

    return request(app.getHttpServer())
      .get(`/lodgings/${lodgingId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });
});