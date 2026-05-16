import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  sendMessage(payload: ContactPayload): Observable<ContactPayload> {
    return of(payload).pipe(delay(1400));
  }
}
