import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

let self: PainelControle

@Injectable({
  providedIn: 'root'
})
export class PainelControle {
  // Anúncio do evento de mudar de algoritmo: quando mudar de algoritmo, ele assume o nome do algoritmo
  private algoritmoAnnouncedSource = new Subject<string>()

  // Anúncio dos eventos de controle: quando o botão for pressionado, isso muda pra verdadeiro
  private limparAnnouncedSource = new Subject<boolean>()
  private iniciarAnnoncedSource = new Subject<boolean>()
  private pausarAnnouncedSource = new Subject<boolean>()
  private pararAnnouncedSource = new Subject<boolean>()

  // Observadores: eles respondem o valor atual da variável e tem umas funções interessates de detecção de mudanças de estado!
  algoritmoAnnounced$ = this.algoritmoAnnouncedSource.asObservable()

  limparAnnounced$ = this.limparAnnouncedSource.asObservable()
  iniciarAnnounced$ = this.iniciarAnnoncedSource.asObservable()
  pausarAnnounced$ = this.pausarAnnouncedSource.asObservable()
  pararAnnounced$ = this.pararAnnouncedSource.asObservable()

  // Observador de Botoes Habilitados
  private botoesAnnouncedSource = new Subject<Array<string>>()
  botoesAnnounced$ = this.botoesAnnouncedSource.asObservable()
  private botoesHabilitados = ['limpar']

  constructor() {
    self = this;
    self.botoesAnnouncedSource.next(self.botoesHabilitados)
  }

  announceLimpar(limpar: boolean) {
    self.limparAnnouncedSource.next(limpar)
  }

  announceIniciar(iniciar: boolean) {
    self.iniciarAnnoncedSource.next(iniciar)
  }

  announcePausar(pausar: boolean) {
    self.pausarAnnouncedSource.next(pausar)
  }

  announceParar(cancelar: boolean) {
    self.pararAnnouncedSource.next(cancelar)
  }

  announceAlgoritmo(algoritmo: string) {
    self.algoritmoAnnouncedSource.next(algoritmo)
  }

  habilitarBotao(botao: string) {
    if (self.botoesHabilitados.findIndex(elemento => botao === elemento) === -1) {
      self.botoesHabilitados.push(botao)
      self.botoesAnnouncedSource.next(self.botoesHabilitados)
    }
  }

  desabilitarBotao(botao: string) {
    const index = self.botoesHabilitados.findIndex(elemento => botao === elemento)
    if (index > -1) {
      self.botoesHabilitados.splice(index, 1)
      self.botoesAnnouncedSource.next(self.botoesHabilitados)
    }
  }
}
