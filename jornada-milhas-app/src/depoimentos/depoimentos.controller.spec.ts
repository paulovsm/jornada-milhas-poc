import { Test, TestingModule } from '@nestjs/testing';
import { DepoimentosController } from './depoimentos.controller';
import { DepoimentosService } from './depoimentos.service';
import { randomUUID } from 'crypto';
import { Depoimento } from './depoimento.interface';

describe('DepoimentosController', () => {
  let controller: DepoimentosController;
  let service: DepoimentosService;
  let randomId: string;

  beforeEach(async () => {
    randomId = randomUUID();
    const depoimentosMock: Depoimento[] = [
      { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' },
      { nome: 'Test 2', depoimento: 'This is another test', foto: 'test2.jpg' },
      { nome: 'Test 3', depoimento: 'This is a third test', foto: 'test3.jpg' },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepoimentosController],
      providers: [
        {
          provide: DepoimentosService,
          useValue: {
            getDepoimentos: jest.fn().mockResolvedValue([]),
            createDepoimento: jest.fn().mockResolvedValue({
              id: randomId,
              foto: "foto_url.jpg",
              depoimento: "meu depoimento",
              nome: "Fulano de Tal",
            }),
            updateDepoimento: jest.fn().mockResolvedValue({
              id: randomId,
              foto: "new_foto_url.jpg",
              depoimento: "meu novo depoimento",
              nome: "Fulano",
            }),
            deleteDepoimento: jest.fn().mockResolvedValue({}),
            getRandomDepoimentos: jest.fn().mockResolvedValue(depoimentosMock),
          },
        },
      ],
    }).compile();

    controller = module.get<DepoimentosController>(DepoimentosController);
    service = module.get<DepoimentosService>(DepoimentosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDepoimentos', () => {
    it('should return an array of depoimentos', async () => {
      expect(await controller.getDepoimentos()).toEqual([]);
      expect(service.getDepoimentos).toBeCalled();
    });
  });

  describe('createDepoimento', () => {
    it('should create a depoimento and return it', async () => {
      const depoimento: Depoimento = { foto: 'foto_url.jpg', depoimento: 'meu depoimento', nome: 'Fulano de Tal' };

      expect(await controller.createDepoimento(depoimento)).toEqual({ id: randomId, ...depoimento });
      expect(service.createDepoimento).toHaveBeenCalledWith(depoimento);
    });
  });

  describe('updateDepoimento', () => {
    it('should update a depoimento and return it', async () => {
      const depoimento: Depoimento = { id: randomId, foto: 'new_foto_url.jpg', depoimento: 'meu novo depoimento', nome: 'Fulano' };

      expect(await controller.updateDepoimento(depoimento)).toEqual(depoimento);
      expect(service.updateDepoimento).toHaveBeenCalledWith(depoimento);
    });
  });

  describe('deleteDepoimento', () => {
    it('should delete a depoimento and return it', async () => {
      expect(await controller.deleteDepoimento(randomId)).toEqual({});
      expect(service.deleteDepoimento).toHaveBeenCalledWith(randomId);
    });
  });

  describe('getRandomDepoimentos', () => {
    it('should return an array of 3 depoimentos', async () => {
      const depoimentos = await controller.getDepoimentosHome();
      expect(depoimentos).toHaveLength(3);
      expect(service.getRandomDepoimentos).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    it('should return a depoimento with the given name', async () => {
      const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
      service.createDepoimento(depoimento);
      const foundDepoimento = await controller.findByName('Test');
      expect(foundDepoimento).toEqual(depoimento);
    });
  });

});