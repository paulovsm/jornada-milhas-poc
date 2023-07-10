import { Test, TestingModule } from '@nestjs/testing';
import { DestinosController } from './destinos.controller';
import { DestinosService } from './destinos.service';
import { randomUUID } from 'crypto';
import { Destino } from './destino.interface';

describe('DestinosController', () => {
  let controller: DestinosController;
  let service: DestinosService;
  let randomId: string;

  beforeEach(async () => {
    randomId = randomUUID();
    const destinosMock: Destino[] = [
      { nome: 'Test', preco: 100, foto: 'test.jpg' },
      { nome: 'Test 2', preco: 200, foto: 'test2.jpg' },
      { nome: 'Test 3', preco: 300, foto: 'test3.jpg' },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinosController],
      providers: [
        {
          provide: DestinosService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            createDestino: jest.fn().mockResolvedValue({
              id: randomId,
              foto: "foto_url.jpg",
              nome: "Fulano de Tal",
              preco: 100,
            }),
            updateDestino: jest.fn().mockResolvedValue({
              id: randomId,
              foto: "new_foto_url.jpg",
              nome: "Fulano",
              preco: 200,
            }),
            deleteDestino: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<DestinosController>(DestinosController);
    service = module.get<DestinosService>(DestinosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of destinos', async () => {
      expect(await controller.findAll()).toEqual([]);
      expect(service.findAll).toBeCalled();
    });
  });

  describe('create', () => {
    it('should create a destino and return it', async () => {
      const destino: Destino = { foto: 'foto_url.jpg', nome: 'Fulano de Tal', preco: 100 };

      expect(await controller.create(destino)).toEqual({ id: randomId, ...destino });
      expect(service.createDestino).toHaveBeenCalledWith(destino);
    });
  });

  describe('update', () => {
    it('should update a destino and return it', async () => {
      const destino: Destino = { id: randomId, foto: 'new_foto_url.jpg', nome: 'Fulano', preco: 200 };

      expect(await controller.update(randomId, destino)).toEqual(destino);
      expect(service.updateDestino).toHaveBeenCalledWith(randomId, destino);
    });
  });

  describe('delete', () => {
    it('should delete a destino and return it', async () => {
      expect(await controller.delete(randomId)).toEqual({});
      expect(service.deleteDestino).toHaveBeenCalledWith(randomId);
    });
  });

});
