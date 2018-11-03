import { TestBed } from '@angular/core/testing';

import { AlgoritmosService } from './algoritmos.service';

describe('AlgoritmosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlgoritmosService = TestBed.get(AlgoritmosService);
    expect(service).toBeTruthy();
  });
});
