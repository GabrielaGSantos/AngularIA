import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlgoritmosService {

  constructor() { }

  private bfsAnnounced = new Subject<boolean>()
 
  bfsAnnounced$ = this.bfsAnnounced.asObservable()

  algoritmos(algoritmo: string){
    if(algoritmo == "bfs")
      this.bfsAnnounced.next(true)
  }
}
