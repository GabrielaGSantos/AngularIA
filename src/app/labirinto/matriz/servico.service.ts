import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlgoritmosService } from './algoritmos/algoritmos.service';

@Injectable({
  providedIn: 'root'
})
export class Service {

  // Anúncio do evento de mudar de algoritmo: quando mudar de algoritmo, ele assume o nome do algoritmo
  private algoritmoAnnouncedSource = new Subject<string>()

  // Anúncio dos eventos de controle: quando o botão for pressionado, isso muda pra verdadeiro
  private limparAnnouncedSource = new Subject<boolean>()
  private iniciarAnnoncedSource = new Subject<boolean>()
  private pausarAnnouncedSource = new Subject<boolean>()
  private cancelarAnnouncedSource = new Subject<boolean>()

  // Observadores: eles respondem o valor atual da variável e tem umas funções interessates de detecção de mudanças de estado!
  algoritmoAnnounced$ = this.algoritmoAnnouncedSource.asObservable()

  limparAnnounced$ = this.limparAnnouncedSource.asObservable()
  iniciarAnnounced$ = this.iniciarAnnoncedSource.asObservable()
  pausarAnnounced$ = this.pausarAnnouncedSource.asObservable()
  cancelarAnnounced$ = this.cancelarAnnouncedSource.asObservable()

  constructor(servicoAlgoritmo: AlgoritmosService) { }

  announceLimpar(limpar: boolean) {
    this.limparAnnouncedSource.next(limpar)
  }

  announceIniciar(iniciar: boolean) {
    this.iniciarAnnoncedSource.next(iniciar)
  }

  announcePausar(pausar: boolean) {
    this.pausarAnnouncedSource.next(pausar)
  }

  announceCancelar(cancelar: boolean) {
    this.cancelarAnnouncedSource.next(cancelar)
  }

  announceAlgoritmo(algoritmo: string) {
    this.algoritmoAnnouncedSource.next(algoritmo)
  }
}
