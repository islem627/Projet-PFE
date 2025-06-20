import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    constructor(private toastr: ToastrService) {}
    handleError(error: any, context: string) {
        const message = error.message || 'Erreur inconnue';
        console.error(`${context}:`, error);
        this.toastr.error(message, context);
        return message;
    }
}