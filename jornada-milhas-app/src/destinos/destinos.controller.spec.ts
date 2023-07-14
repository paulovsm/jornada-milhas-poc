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
      { id: randomId, nome: 'Test', preco: 100, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' },
      { nome: 'Test 2', preco: 200, foto1: 'test2.jpg', foto2: 'test2.jpg', meta: 'meta', textoDescritivo: 'texto' },
      { nome: 'Test 3', preco: 300, foto1: 'test3.jpg', foto2: 'test3.jpg', meta: 'meta', textoDescritivo: 'texto' },
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
              foto1: 'foto1_url.jpg',
              foto2: 'foto2_url.jpg',
              nome: 'Fulano de Tal',
              preco: 100,
              meta: 'meta',
              textoDescritivo: 'texto'
            }),
            updateDestino: jest.fn().mockResolvedValue({
              id: randomId,
              foto1: 'new_foto1_url.jpg', 
              foto2: 'new_foto2_url.jpg', 
              nome: 'Fulano', 
              preco: 200, 
              meta: 'nova meta', 
              textoDescritivo: 'novo texto'
            }),
            deleteDestino: jest.fn().mockResolvedValue({}),
            findByName: jest.fn().mockResolvedValue(destinosMock[0]),
            findById: jest.fn().mockResolvedValue(destinosMock[0]),
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
      const destino: Destino = { foto1: 'foto1_url.jpg', foto2: 'foto2_url.jpg', nome: 'Fulano de Tal', preco: 100, meta: 'meta', textoDescritivo: 'texto' };

      expect(await controller.create(destino)).toEqual({ id: randomId, ...destino });
      expect(service.createDestino).toHaveBeenCalledWith(destino);
    });
  });

  describe('update', () => {
    it('should update a destino and return it', async () => {
      const destino: Destino = { id: randomId, foto1: 'new_foto1_url.jpg', foto2: 'new_foto2_url.jpg', nome: 'Fulano', preco: 200, meta: 'nova meta', textoDescritivo: 'novo texto' };

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

  describe('findById', () => {
    it('should return a destino with the given id', async () => {
      const destino: Destino = { nome: 'Test', preco: 100, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
      service.createDestino(destino);
      const foundDestino = await controller.findById(randomId);
      expect(foundDestino).toEqual({id: randomId, ...destino});
    });
  });


  describe('findByName', () => {
    it('should return a depoimento with the given name', async () => {
      const depoimento: Destino = { nome: 'Test', preco: 100, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
      service.createDestino(depoimento);
      const foundDepoimento = await controller.findByName('Test');
      expect(foundDepoimento).toEqual({id: randomId, ...depoimento});
    });
  });

});
