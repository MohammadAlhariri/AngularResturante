import {Injectable} from '@angular/core';
import {Leader} from '../shared/leader';
import {Leaders} from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() {
  }

  getLeader(id: string): Observable<Leader> {
    return of(Leaders.filter((Leader) => (Leader.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader> {
    return of(Leaders.filter((Leader) => Leader.featured)[0]).pipe(delay(2000));

  }

  getLeaders(): Observable<Leader[]> {
    return of(Leaders).pipe(delay(2000));
  }



}
