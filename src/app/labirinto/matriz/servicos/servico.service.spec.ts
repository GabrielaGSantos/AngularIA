import { TestBed } from '@angular/core/testing';

import { Service } from './servico.service';

describe('ServicoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Service = TestBed.get(Service);
    expect(service).toBeTruthy();
  });
});
