/*import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
@Component({
    selector: 'app-stomp-test',
    template: `
        <h1>Test STOMP WebSocket</h1>
        <p>Status: <span [style.color]="statusColor">{{ status }}</span></p>
        <div>
            <p *ngFor="let message of messages">{{ message }}</p>
        </div>
    `,
    styles: []
})
export class StompTestComponent implements OnInit {
    status = 'Disconnected';
    statusColor = 'red';
    messages: string[] = [];
    private stompClient: any;
    ngOnInit() {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, (frame: any) => {
            console.log('WebSocket connected:', frame);
            this.status = 'Connected';
            this.statusColor = 'green';
            this.stompClient.subscribe('/topic/location/60', (message: any) => {
                const location = JSON.parse(message.body);
                console.log('Received message:', location);
                this.messages.push(JSON.stringify(location));
            });
        }, (error: any) => {
            console.error('WebSocket error:', error);
            this.status = 'Error: ' + error;
            this.statusColor = 'red';
            this.messages.push('Error: ' + error);
        });
    }
}
    */



import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
@Component({
    selector: 'app-stomp-test',
    template: `
        <h1>Test STOMP WebSocket</h1>
        <p>Status: <span [style.color]="statusColor">{{ status }}</span></p>
        <div>
            <p *ngFor="let message of messages">{{ message }}</p>
        </div>
    `,
    styles: []
})
export class StompTestComponent implements OnInit {
    status = 'Disconnected';
    statusColor = 'red';
    messages: string[] = [];
    private stompClient: Client;
    ngOnInit() {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000, // Reconnexion toutes les 5 secondes
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (str) => console.log(str)
        });
        this.stompClient.onConnect = (frame) => {
            console.log('WebSocket connected:', frame);
            this.status = 'Connected';
            this.statusColor = 'green';
            this.stompClient.subscribe('/topic/location/60', (message) => {
                const location = JSON.parse(message.body);
                console.log('Received message:', location);
                this.messages.push(JSON.stringify(location));
            });
        };
        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            this.status = 'Error: ' + frame.headers['message'];
            this.statusColor = 'red';
            this.messages.push('Error: ' + frame.headers['message']);
        };
        this.stompClient.onWebSocketClose = () => {
            console.log('WebSocket closed, reconnecting...');
            this.status = 'Disconnected';
            setTimeout(() => this.stompClient.activate(), 5000);
            this.statusColor = 'red';
        };
        this.stompClient.activate();
    }
}