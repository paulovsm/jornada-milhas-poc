import { Test, TestingModule } from '@nestjs/testing';
import { DepoimentosService } from './depoimentos.service';
import { Supabase } from '../lib/supabaseClient';
import { Depoimento } from './depoimento.interface';
import { anything, instance, mock, verify, when } from 'ts-mockito';

describe('DepoimentosService', () => {
  let service: DepoimentosService;
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
      select: jest.fn().mockResolvedValue({ data: [{}], error: null })
    };

    when(mockSupabase.getClient()).thenReturn(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepoimentosService,
        { provide: Supabase, useValue: instance(mockSupabase) },
      ],
    }).compile();

    service = module.get<DepoimentosService>(DepoimentosService);
  });

  it('should get depoimentos', async () => {
    const depoimentos: Depoimento[] = [{ nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' }];

    mockSupabaseClient.select.mockResolvedValue({ data: depoimentos, error: null });

    const result = await service.getDepoimentos();
    expect(result).toEqual(depoimentos);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
  });

  it('should throw an error if get depoimentos failed', async () => {
    const errorMessage = 'Error occurred';
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: new Error(errorMessage) });

    await expect(service.getDepoimentos()).rejects.toThrow(errorMessage);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
  });

  it('should create depoimento', async () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    await service.createDepoimento(depoimento);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([depoimento]);
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

  it('should throw an error if create depoimento failed', async () => {
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: null });
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };

    await expect(service.createDepoimento(depoimento)).rejects.toThrow('Failed to create depoimento');

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.insert).toHaveBeenCalledWith([depoimento]);
  });

  it('should update a depoimento', async () => {
    const depoimento: Depoimento = { id: '1', nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const updatedDepoimento = { ...depoimento, mensagem: 'Updated test message' };

    mockSupabaseClient.update.mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();
    mockSupabaseClient.select.mockResolvedValue({ data: [updatedDepoimento], error: null });

    const result = await service.updateDepoimento(updatedDepoimento);
    expect(result).toEqual(updatedDepoimento);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.update).toHaveBeenCalledWith(updatedDepoimento);
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id: updatedDepoimento.id });
    expect(mockSupabaseClient.select).toHaveBeenCalled();
  });

  it('should throw an error if update depoimento failed', async () => {
    const depoimento: Depoimento = { id: '1', nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };

    mockSupabaseClient.update.mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();
    mockSupabaseClient.select.mockResolvedValue({ data: null, error: null });

    await expect(service.updateDepoimento(depoimento)).rejects.toThrow('Failed to update depoimento');

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.update).toHaveBeenCalledWith(depoimento);
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id: depoimento.id });
  });

  it('should delete a depoimento', async () => {
    const id = '1';
    mockSupabaseClient.delete = jest.fn().mockReturnThis();
    mockSupabaseClient.match.mockReturnThis();

    await service.deleteDepoimento(id);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id });
  });

  it('should throw an error if delete depoimento failed', async () => {
    const id = '1';
    const errorMessage = 'Error occurred';

    mockSupabaseClient.delete.mockReturnThis();
    mockSupabaseClient.match = jest.fn().mockResolvedValue({ error: new Error(errorMessage) });

    await expect(service.deleteDepoimento(id)).rejects.toThrow(errorMessage);

    verify(mockSupabase.getClient()).once();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('depoimentos');
    expect(mockSupabaseClient.delete).toHaveBeenCalled();
    expect(mockSupabaseClient.match).toHaveBeenCalledWith({ id });
  });

  it('should return all depoimentos if total is less than or equal to 3', async () => {
    const depoimentos: Depoimento[] = [
      { id: '1', nome: 'Test1', depoimento: 'This is a test1', foto: 'test.jpg' },
      { id: '2', nome: 'Test2', depoimento: 'This is a test2', foto: 'test.jpg' },
      { id: '3', nome: 'Test3', depoimento: 'This is a test3', foto: 'test.jpg' },
    ];
    mockSupabaseClient.select.mockResolvedValue({ data: depoimentos, error: null });

    const result = await service.getRandomDepoimentos();

    expect(result).toEqual(depoimentos);
  });

  it('should return 3 random depoimentos if total is more than 3', async () => {
    const depoimentos: Depoimento[] = [
      { id: '1', nome: 'Test1', depoimento: 'This is a test1', foto: 'test.jpg' },
      { id: '2', nome: 'Test2', depoimento: 'This is a test2', foto: 'test.jpg' },
      { id: '3', nome: 'Test3', depoimento: 'This is a test3', foto: 'test.jpg' },
      { id: '4', nome: 'Test4', depoimento: 'This is a test4', foto: 'test.jpg' },
      { id: '5', nome: 'Test5', depoimento: 'This is a test5', foto: 'test.jpg' },
      { id: '6', nome: 'Test6', depoimento: 'This is a test6', foto: 'test.jpg' }
    ];

    mockSupabaseClient.select.mockResolvedValue({ data: depoimentos, error: null });

    const result = await service.getRandomDepoimentos();

    expect(result.length).toBe(3);
  });

  it('should throw an error if select depoimentos failed', async () => {
    const errorMessage = 'Error occurred';

    mockSupabaseClient.select.mockResolvedValue({ data: null, error: new Error(errorMessage) });

    await expect(service.getRandomDepoimentos()).rejects.toThrow(errorMessage);
  });


});

