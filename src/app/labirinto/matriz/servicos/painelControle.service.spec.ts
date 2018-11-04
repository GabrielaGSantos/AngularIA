import { TestBed } from '@angular/core/testing';

import { PainelControle } from './painelControle.service';

describe('ServicoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PainelControle = TestBed.get(PainelControle);
    expect(service).toBeTruthy();
  });
});
