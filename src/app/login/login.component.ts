import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Data } from '../data';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  username:string = "";
  password:string = "";
  url:string = "http://localhost:3030/users";
  constructor(private http: HttpClient, private router: Router, private data: Data) { 
    
  }

  ngOnInit() {
    if(localStorage.getItem('tasksToken') !== ""){
      this.router.navigate(['messages']);
    } else {
      this.router.navigate(['']);
    }
  }

  login(){
    let req = {
      email:this.username,
      password:this.password
    };
    this.http.post(this.url+"/login",req,httpOptions)
    .subscribe(res => this.doLogin(res));
  }

  doLogin(user){
    this.data.storage = user;
    localStorage.setItem('tasksToken', 'bearer '+user.token);
    this.router.navigate(['messages']);
  }
}
