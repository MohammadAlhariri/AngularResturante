import {Injectable} from '@angular/core';
import {Leader} from '../shared/leader';
import {Leaders} from '../shared/leaders';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() {
  }

  getLeader(id: string): Promise<Leader> {
    return Promise.resolve(Leaders.filter((Leader) => (Leader.id === id))[0]);
  }
  getFeaturedLeader(): Promise<Leader> {
    return Promise.resolve(Leaders.filter((Leader) => Leader.featured)[0]);
  }
  getLeaders():Promise<Leader[]>{
    return Promise.resolve(Leaders);
  }
/*  getDishes(): Promise<Dish[]> {
    return Promise.resolve(DISHES);
  }

  getDish(id: number): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => (dish.id === id))[0]);
  }

  getFeaturedDish(): Promise<Dish> {
    return Promise.resolve(DISHES.filter((dish) => dish.featured)[0]);
  }*/

}
