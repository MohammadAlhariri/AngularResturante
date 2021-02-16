import {Injectable} from '@angular/core';
import {Leader} from '../shared/leader';
import {Leaders} from '../shared/leaders';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() {
  }

  getLeader(id: string): Leader {
    return Leaders.filter((Leader) => (Leader.id === id))[0];
  }
  getFeaturedLeader(): Leader {
    return Leaders.filter((Leader) => Leader.featured)[0];
  }
  getLeaders():Leader[]{
    return Leaders;

  }
}
