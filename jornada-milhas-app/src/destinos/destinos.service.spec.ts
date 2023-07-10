import { Test, TestingModule } from '@nestjs/testing';
import { DestinosService } from './destinos.service';
import { Destino } from './destino.interface';

describe('DestinosService', () => {
  let service: DestinosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DestinosService],
    }).compile();

    service = module.get<DestinosService>(DestinosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of destinos', () => {
    const result: Destino[] = [];
    jest.spyOn(service, 'findAll').mockImplementation(() => result);
    expect(service.findAll()).toBe(result);
  });

  it('should add a destino', () => {
    const destino: Destino = { preco: 11, nome: 'This is a test', foto: 'test.jpg' };
    const destinoCriado = service.createDestino(destino);
    expect(service.findAll()).toContain(destinoCriado);
  });

  it('should update a destino', () => {
    const destino: Destino = { preco: 11, nome: 'This is a test', foto: 'test.jpg' };
    const destinoCriado = service.createDestino(destino);
    const updatedDestino: Destino = { id: destinoCriado.id, preco: 12, nome: 'Updated test', foto: 'updated.jpg' };
    service.updateDestino(updatedDestino.id, updatedDestino);
    expect(service.findAll()).toContainEqual(updatedDestino);
  });

  it('should delete a destino', () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto: 'test.jpg' };
    const destinoCriado = service.createDestino(destino);
    service.deleteDestino(destinoCriado.id);
    expect(service.findAll()).not.toContain(destino);
  });

});
