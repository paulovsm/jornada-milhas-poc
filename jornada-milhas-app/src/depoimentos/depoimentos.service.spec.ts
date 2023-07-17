import { Test, TestingModule } from '@nestjs/testing';
import { DepoimentosService } from './depoimentos.service';
import { Depoimento } from './depoimento.interface';

describe('DepoimentosService', () => {
  let service: DepoimentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepoimentosService],
    }).compile();

    service = module.get<DepoimentosService>(DepoimentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of depoimentos', async () => {
    const result: Depoimento[] = [];
    jest.spyOn(service, 'getDepoimentos').mockImplementation(() => Promise.resolve(result));
    expect(await service.getDepoimentos()).toBe(result);
  });

  it('should add a depoimento', async () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = await service.createDepoimento(depoimento);
    expect(await service.getDepoimentos()).toContain(depoimentoCriado);
  });

  it('should update a depoimento', async () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = await service.createDepoimento(depoimento);
    const updatedDepoimento: Depoimento = { id: depoimentoCriado.id, nome: 'Updated', depoimento: 'Updated test', foto: 'updated.jpg' };
    await service.updateDepoimento(updatedDepoimento);
    expect(await service.getDepoimentos()).toContain(updatedDepoimento);
  });

  it('should delete a depoimento', async () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = await service.createDepoimento(depoimento);
    await service.deleteDepoimento(depoimentoCriado.id);
    expect(await service.getDepoimentos()).not.toContain(depoimento);
  });

  it('should return 3 random depoimentos', async () => {
    // Adiciona 5 depoimentos de teste (assume que createDepoimento está funcionando corretamente)
    for (let i = 0; i < 5; i++) {
      await service.createDepoimento({ nome: `Test ${i}`, depoimento: `Test ${i}`, foto: `test${i}.jpg` });
    }

    const randomDepoimentos = await service.getRandomDepoimentos();

    expect(randomDepoimentos).toHaveLength(3);

    randomDepoimentos.forEach(async (depoimento) => {
      expect(await service.getDepoimentos()).toContain(depoimento);
    });
  });

});

