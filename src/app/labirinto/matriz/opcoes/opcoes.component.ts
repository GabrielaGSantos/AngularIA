import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-opcoes',
  templateUrl: './opcoes.component.html',
  styleUrls: ['./opcoes.component.css']
})
export class OpcoesComponent implements OnInit {
  @Output() event = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }

  limpar() {
    this.event.emit('limpar');
  }
}
