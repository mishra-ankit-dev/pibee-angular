import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/app-service/chat-service/chat.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.css']
})
export class ChatappComponent implements OnInit {

  formData = {
    display_message : ''
  }

  sendData = {
    'command' : 'new_message',
    'from' : '',
    'message' : "",
  }
  
  constructor(private _chat : ChatService) { }

  ngOnInit(): void {
    this.sendData['from'] = localStorage.getItem('username');
    this._chat.connect(this.formData)
  }

  sendMessage($event) {
    this._chat.createMessage(this.sendData)
  }
}
