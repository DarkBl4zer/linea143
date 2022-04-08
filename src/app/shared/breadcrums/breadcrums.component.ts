import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrums.component.html',
  styles: [
  ]
})
export class breadcrumsComponent implements OnDestroy {


  public titulo: String;
  public tituloSubs$: Subscription;

  constructor( private router:Router ) {
    this.tituloSubs$ = this.getArgumentosRuta()
      .subscribe( ({titulo}) => {
        this.titulo = titulo;
        document.title = ` AdminPro - ${titulo}`; 
      });
  }

  ngOnDestroy(): void{
    this.tituloSubs$ 
  }
  

  getArgumentosRuta() {
    return this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd  ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data ),
    );
  }



}
