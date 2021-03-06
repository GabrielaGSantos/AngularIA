import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { IndexComponent } from './index/index.component';
import { LabirintoComponent } from './labirinto/labirinto.component';
import { AjudaComponent } from './ajuda/ajuda.component';
import { MatrizComponent } from './labirinto/matriz/matriz.component';
import { OpcoesComponent } from './labirinto/matriz/opcoes/opcoes.component';
import { PainelControle } from './labirinto/matriz/servicos/painelControle.service';
import { AlgoritmosService } from './labirinto/matriz/servicos/algoritmos.service';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    IndexComponent,
    LabirintoComponent,
    AjudaComponent,
    MatrizComponent,
    OpcoesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    PainelControle,
    AlgoritmosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
