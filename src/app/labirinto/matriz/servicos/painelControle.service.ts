import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { Labirinto } from '../classes/labirinto';

let self: PainelControle

@Injectable({
  providedIn: 'root'
})
export class PainelControle {
  // Anúncio do evento de mudar de algoritmo: quando mudar de algoritmo, ele assume o nome do algoritmo
  private algoritmoAnnouncedSource = new Subject<string>()

  // Anúncio do evento de mudar de algoritmo: quando mudar de heurística, ele assume o nome da heuristica
  private heristicaAnnouncedSource = new Subject<string>()

  // Anúncio dos eventos de controle: quando o botão for pressionado, isso muda pra verdadeiro
  private limparAnnouncedSource = new Subject<boolean>()
  private iniciarAnnoncedSource = new Subject<boolean>()
  private pausarAnnouncedSource = new Subject<boolean>()
  private pararAnnouncedSource = new Subject<boolean>()
  private salvarAnnouncedSource = new Subject<boolean>()
  private abrirAnnouncedSource = new Subject<Labirinto>()

  // Observadores: eles respondem o valor atual da variável e tem umas funções interessates de detecção de mudanças de estado!
  algoritmoAnnounced$ = this.algoritmoAnnouncedSource.asObservable()
  heristicaAnnounced$ = this.heristicaAnnouncedSource.asObservable()

  limparAnnounced$ = this.limparAnnouncedSource.asObservable()
  iniciarAnnounced$ = this.iniciarAnnoncedSource.asObservable()
  pausarAnnounced$ = this.pausarAnnouncedSource.asObservable()
  pararAnnounced$ = this.pararAnnouncedSource.asObservable()
  salvarAnnounced$ = this.salvarAnnouncedSource.asObservable()
  abrirAnnounced$ = this.abrirAnnouncedSource.asObservable()

  // Observador de Botoes Habilitados
  private botoesAnnouncedSource = new Subject<Array<string>>()
  botoesAnnounced$ = this.botoesAnnouncedSource.asObservable()
  private botoesHabilitados = ['limpar']

  // Link Exportar Labirinto
  private linkDownloadLabirintoAnnounceSource = new Subject<SafeUrl>()
  linkDownloadLabirintoAnnounced$ = this.linkDownloadLabirintoAnnounceSource.asObservable()

  constructor() {
    self = this;
    self.botoesAnnouncedSource.next(self.botoesHabilitados)
  }

  announceLimpar(limpar: boolean) {
    self.limparAnnouncedSource.next(limpar)
  }

  announceSalvar(salvar: boolean) {
    self.salvarAnnouncedSource.next(salvar)
  }
  announceAbrir(novoLabirinto: Labirinto) {
    self.abrirAnnouncedSource.next(novoLabirinto)
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

  announceHeuristica(heuristica: string) {
    self.heristicaAnnouncedSource.next(heuristica)
  }

  announcelinkDownloadLabirinto(linkDownloadLabirinto: SafeUrl) {
    self.linkDownloadLabirintoAnnounceSource.next(linkDownloadLabirinto)
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
