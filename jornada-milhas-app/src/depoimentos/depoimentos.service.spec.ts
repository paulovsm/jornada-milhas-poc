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

  it('should return an array of depoimentos', () => {
    const result: Depoimento[] = [];
    jest.spyOn(service, 'getDepoimentos').mockImplementation(() => result);
    expect(service.getDepoimentos()).toBe(result);
  });

  it('should add a depoimento', () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = service.createDepoimento(depoimento);
    expect(service.getDepoimentos()).toContain(depoimentoCriado);
  });

  it('should update a depoimento', () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = service.createDepoimento(depoimento);
    const updatedDepoimento: Depoimento = { id: depoimentoCriado.id, nome: 'Updated', depoimento: 'Updated test', foto: 'updated.jpg' };
    service.updateDepoimento(updatedDepoimento);
    expect(service.getDepoimentos()).toContain(updatedDepoimento);
  });

  it('should delete a depoimento', () => {
    const depoimento: Depoimento = { nome: 'Test', depoimento: 'This is a test', foto: 'test.jpg' };
    const depoimentoCriado = service.createDepoimento(depoimento);
    service.deleteDepoimento(depoimentoCriado.id);
    expect(service.getDepoimentos()).not.toContain(depoimento);
  });

  it('should return 3 random depoimentos', () => {
    // Adiciona 5 depoimentos de teste (assume que createDepoimento está funcionando corretamente)
    for (let i = 0; i < 5; i++) {
      service.createDepoimento({ nome: `Test ${i}`, depoimento: `Test ${i}`, foto: `test${i}.jpg` });
    }

    const randomDepoimentos = service.getRandomDepoimentos();

    expect(randomDepoimentos).toHaveLength(3);

    randomDepoimentos.forEach((depoimento) => {
      expect(service.getDepoimentos()).toContain(depoimento);
    });
  });

});

