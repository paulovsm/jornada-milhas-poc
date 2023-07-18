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

  it('should add a destino', async () => {
    const destino: Destino = { preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    const destinoCriado = await service.createDestino(destino);
    expect(service.findAll()).toContain(destinoCriado);
  });

  it('should update a destino', async () => {
    const destino: Destino = { preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    const destinoCriado = await service.createDestino(destino);
    const updatedDestino: Destino = { id: destinoCriado.id, preco: 12, nome: 'Updated test', foto1: 'updated.jpg', foto2: 'updated.jpg', meta: 'meta', textoDescritivo: 'texto' };
    await service.updateDestino(updatedDestino.id, updatedDestino);
    expect(service.findAll()).toContainEqual(updatedDestino);
  });

  it('should delete a destino', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    const destinoCriado = await service.createDestino(destino);
    await service.deleteDestino(destinoCriado.id);
    expect(service.findAll()).not.toContain(destino);
  });

  it('should find a destino by name', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    await service.createDestino(destino);
    const foundDestino = await service.findByName('Test');
    expect(foundDestino[0].nome).toEqual(destino.nome);
  });

  it('should find a destino by id', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    const destinoCriado = await service.createDestino(destino);
    const foundDestino = await service.findById(destinoCriado.id);
    expect(foundDestino).toEqual(destinoCriado);
  });

  it('should generate descriptive text for a destino when TextoDescritivo is empty', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: '' };
    const expectedText = 'This is a descriptive text for Rio de Janeiro.';

    jest.spyOn(service, 'generateDescriptiveText').mockResolvedValue(expectedText);

    const destinoCriado = await service.createDestino(destino);

    expect(destinoCriado.textoDescritivo).toEqual(expectedText);
  });

});
