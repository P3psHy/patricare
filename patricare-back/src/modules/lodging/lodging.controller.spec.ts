import { Test } from '@nestjs/testing';
import { LodgingController } from './lodging.controler';
import { LodgingService } from './lodging.service';
import { Lodging } from './entities/lodging.entity';

describe('LodgingController', () => {
  let lodgingController: LodgingController;
  let lodgingService: LodgingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LodgingController],
      providers: [LodgingService],
    }).compile();

    lodgingService = moduleRef.get(LodgingService);
    lodgingController = moduleRef.get(LodgingController);
  });

  describe('create', () => {
    it('should create a new lodging', async () => {
      const createLodgingDto = {
        estLoue: false,
        prixLoyer: 1500,
        superficie: 75,
        nbPiece: 3,
        description: 'Test lodging',
      };
      const result: Lodging = { id: 1, ...createLodgingDto };
      jest
        .spyOn(lodgingService, 'create')
        .mockImplementation(() => result);
      expect(await lodgingController.create(createLodgingDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of lodgings', async () => {
      const result: Lodging[] = [
        {
          id: 1,
          estLoue: true,
          prixLoyer: 1200,
          superficie: 65,
          nbPiece: 2,
          description: 'Appartement 1',
        },
        {
          id: 2,
          estLoue: false,
          prixLoyer: 2000,
          superficie: 120,
          nbPiece: 4,
          description: 'Appartement 2',
        },
      ];
      jest.spyOn(lodgingService, 'findAll').mockImplementation(() => result);
      expect(await lodgingController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a lodging for id 1', async () => {
      const result: Lodging = {
        id: 1,
        estLoue: true,
        prixLoyer: 1200,
        superficie: 65,
        nbPiece: 2,
        description: 'Appartement test',
      };
      jest
        .spyOn(lodgingService, 'findOne')
        .mockImplementation(() => result);
      const res = await lodgingController.findOne('1');
      expect(res).toBe(result);
      expect(lodgingService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a lodging', async () => {
      const updateLodgingDto = {
        estLoue: true,
        prixLoyer: 1800,
      };
      const result: Lodging = {
        id: 1,
        estLoue: true,
        prixLoyer: 1800,
        superficie: 75,
        nbPiece: 3,
        description: 'Updated lodging',
      };
      jest
        .spyOn(lodgingService, 'update')
        .mockImplementation(() => result);
      const res = await lodgingController.update('1', updateLodgingDto);
      expect(res).toBe(result);
      expect(lodgingService.update).toHaveBeenCalledWith(1, updateLodgingDto);
    });
  });

  describe('delete', () => {
    it('should delete a lodging', async () => {
      jest.spyOn(lodgingService, 'delete').mockImplementation(() => true);
      const res = await lodgingController.delete('1');
      expect(res).toEqual({ success: true });
      expect(lodgingService.delete).toHaveBeenCalledWith(1);
    });
  });
});
