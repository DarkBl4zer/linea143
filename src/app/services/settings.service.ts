import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() { 
    const url = localStorage.getItem('theme') || './assets/css/colors/blue.css';
    this.linkTheme.setAttribute('href',url);
  }

  changeTheme( theme: string){
    const url = `./assets/css/colors/${ theme }.css`;
    this.linkTheme.setAttribute('href',url);
    localStorage.setItem('theme',url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){

    const links =  document.querySelectorAll('.selector'); 
    
    links.forEach( eleme =>{
      eleme.classList.remove('working');
      const btnTheme= eleme.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      if( btnThemeUrl === currentTheme){
        eleme.classList.add('working');
      }

    });
    
    
  }
} 
