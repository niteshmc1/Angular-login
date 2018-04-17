import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages;
  url:string = "http://localhost:3030/users";
  constructor(private http: HttpClient, private data: Data,  private router: Router) { 
    this.getMessages();
  }

  getMessages(){  
    let token = localStorage.getItem('tasksToken');
    this.http.post(this.url+'/getMessages', {} , {
      headers: new HttpHeaders().set('Authorization', token)
    }).subscribe(
      res => this.setMessages(res)/*,
      err => this.router.navigate([''])*/
    );
  }

  setMessages(res){
    this.messages = res.data.thisguy.messages;
  }
  ngOnInit() {
    
  }

}
