import { Test, TestingModule } from '@nestjs/testing';
import { DestinosService } from './destinos.service';
import { Destino } from './destino.interface';
import { Supabase } from '../lib/supabaseClient';
import { instance, mock, verify, when } from 'ts-mockito';

describe('DestinosService', () => {
  let service: DestinosService;
  let mockSupabase: Supabase;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabase = mock(Supabase);
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      select: jest.fn().mockResolvedValue({ data: [{}], error: null }),
      ilike: jest.fn(),
    };

    when(mockSupabase.getClient()).thenReturn(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinosService,
        { provide: Supabase, useValue: instance(mockSupabase) },
      ],
    }).compile();

    service = module.get<DestinosService>(DestinosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get destinos', async () => {
    const destinos: Destino[] = [{ preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' }];

    mockSupabaseClient.select.mockResolvedValue({ data: destinos, error: null });

    const result = await service.findAll();
    expect(result).toEqual(destinos);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
  });

  it('should throw an error if get destinos failed', async () => {
    const errorMessage = 'Error occurred';
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: new Error(errorMessage) });

    await expect(service.findAll()).rejects.toThrow(errorMessage);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
  });

  it('should create destino', async () => {
    const destino: Destino = { preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    await service.createDestino(destino);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([destino]);
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

  it('should throw an error if create destino failed', async () => {
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: null });
    const destino: Destino = { preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };

    await expect(service.createDestino(destino)).rejects.toThrow('Failed to create destino');

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([destino]);
  });

  it('should update a destino', async () => {
    const destino: Destino = { id: '1', preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    const updatedDestino = { ...destino, textDescritivo: 'Updated test message' };

    mockSupabaseClient.update.mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();
    mockSupabaseClient.select.mockResolvedValue({ data: [updatedDestino], error: null });

    const result = await service.updateDestino(updatedDestino.id, updatedDestino);
    expect(result).toEqual(updatedDestino);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.update).toHaveBeenCalledWith(updatedDestino);
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id: updatedDestino.id });
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

  it('should throw an error if update destino failed', async () => {
    const destino: Destino = { id: '1', preco: 11, nome: 'This is a test', foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };

    mockSupabaseClient.update.mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: null });

    await expect(service.updateDestino(destino.id, destino)).rejects.toThrow('Failed to update destino');

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.update).toHaveBeenCalledWith(destino);
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id: destino.id });
  });

  it('should delete a destino', async () => {
    const id = '1';
    mockSupabaseClient.delete = jest.fn().mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();

    await service.deleteDestino(id);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id });
  });

  it('should throw an error if delete destino failed', async () => {
    const id = '1';
    const errorMessage = 'Error occurred';

    mockSupabaseClient.delete.mockReturnThis();
    mockSupabaseClient.match = jest.fn().mockResolvedValue({ error: new Error(errorMessage) });

    await expect(service.deleteDestino(id)).rejects.toThrow(errorMessage);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id });
  });

  it('should find a destino by name', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    mockSupabaseClient.select.mockReturnThis();
    mockSupabaseClient.ilike.mockResolvedValue({ data: [destino], error: null });

    const foundDestino = await service.findByName('Test');
    expect(foundDestino[0].nome).toEqual(destino.nome);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.ilike).toHaveBeenCalledWith('nome', '%Test%');
  });

  it('should find a destino by id', async () => {
    const destino: Destino = { id: '1', nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'texto' };
    mockSupabaseClient.select.mockReturnThis();
    mockSupabaseClient.eq.mockResolvedValue({ data: [destino], error: null });

    const foundDestino = await service.findById(destino.id);
    expect(foundDestino).toEqual(destino);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', destino.id);
  });

  it('should generate descriptive text for a destino when TextoDescritivo is empty', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: '' };
    const expectedText = 'This is a descriptive text for Rio de Janeiro.';

    jest.spyOn(service, 'generateDescriptiveText').mockResolvedValue(expectedText);

    const destinoCriado = await service.createDestino(destino);

    expect(destinoCriado.textoDescritivo).toEqual(expectedText);
    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([destino]);
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

  it('should not generate descriptive text for a destino when TextoDescritivo is not empty', async () => {
    const destino: Destino = { nome: 'Test', preco: 11, foto1: 'test.jpg', foto2: 'test.jpg', meta: 'meta', textoDescritivo: 'Existing text' };
    const expectedText = 'Existing text';

    jest.spyOn(service, 'generateDescriptiveText');

    const destinoCriado = await service.createDestino(destino);

    expect(destinoCriado.textoDescritivo).toEqual(expectedText);
    expect(service.generateDescriptiveText).not.toHaveBeenCalled();
    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('destinos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([destino]);
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

});
