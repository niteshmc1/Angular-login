import { Injectable } from '@angular/core';

@Injectable()
export class Data {
    storage:any;
    constructor(){
        this.storage = {};
    }
}