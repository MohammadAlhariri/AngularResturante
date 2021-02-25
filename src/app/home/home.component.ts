import { Component, OnInit ,Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import {LeaderService} from '../services/leader.service';
import {Leader} from '../shared/leader';
import {expand, flyInOut} from '../animations/app.animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()

  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader:Leader;
  errMess: string;

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              private leaderservice:LeaderService,
              @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish,errmess => this.errMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion);
    this.leaderservice.getFeaturedLeader()
      .subscribe(leader => this.leader = leader);
  }
}
