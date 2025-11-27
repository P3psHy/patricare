import { Test } from '@nestjs/testing';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { Type } from './entities/type.entity';


describe('TypeController', () => {
  let typeController: TypeController;
  let typeService: TypeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [TypeController],
        providers: [TypeService],
      }).compile();

    typeService = moduleRef.get(TypeService);
    typeController = moduleRef.get(TypeController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
        const result = ['test'];
        jest.spyOn(typeService, 'findAll').mockImplementation(() => result as unknown as Type[]);
        expect(await typeController.findAll()).toBe(result);
    });
  });
  describe('findOne', () => {
    it('should return a type for id 1', async () => {
      const result: Type = { id: 1, libelle: 'test' } as Type;
      jest.spyOn(typeService, 'findOne').mockResolvedValue(result);
      const res = await typeController.findOne('1');
      expect(res).toBe(result);
      expect(typeService.findOne).toHaveBeenCalledWith(1);
    });
  });

});