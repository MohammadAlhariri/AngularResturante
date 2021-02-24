import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactType, Feedback} from '../shared/feedback';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import {visibility,expand,flyInOut} from '../animations/app.animation';

/*const DISH = {
  id: '0',
  name: 'Uthappizza',
  image: '/assets/images/uthappizza.png',
  category: 'mains',
  featured: true,
  label: 'Hot',
  price: '4.99',
  // tslint:disable-next-line:max-line-length
  description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
  comments: [
    {
      rating: 5,
      comment: 'Imagine all the eatables, living in conFusion!',
      author: 'John Lemon',
      date: '2012-10-16T17:57:28.556094Z'
    },
    {
      rating: 4,
      comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
      author: 'Paul McVites',
      date: '2014-09-05T17:57:28.556094Z'
    },
    {
      rating: 3,
      comment: 'Eat it, just eat it!',
      author: 'Michael Jaikishan',
      date: '2015-02-13T17:57:28.556094Z'
    },
    {
      rating: 4,
      comment: 'Ultimate, Reaching for the stars!',
      author: 'Ringo Starry',
      date: '2013-12-02T17:57:28.556094Z'
    },
    {
      rating: 2,
      comment: 'It\'s your birthday, we\'re gonna party!',
      author: '25 Cent',
      date: '2011-12-02T17:57:28.556094Z'
    }
  ]
};*/
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  animations: [
    visibility,expand,flyInOut],

  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  dishcopy: Dish;
  visibility = 'shown';

  @ViewChild('fform') feedbackFormDirective;
  errMess: string;

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  formErrors = {
    'name': '',
    'message': '',
  };
  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    }, 'message': {
      'required': 'Message is required.',
      'minlength': 'Message must be at least 2 characters long.',
      'maxlength': 'Message cannot be more than 25 characters long.'
    },

  };

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('baseURL') private baseURL) {
    this.createForm();

  }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
      errmess => this.errMess = <any> errmess);
    /*    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
          .subscribe(dish => {
            this.dish = dish;
            this.setPrevNext(dish.id);
          },errmess => this.errMess = <any>errmess);*/
    /*    this.route.params
          .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
          .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
            errmess => this.errMess = <any>errmess );*/
    this.route.params.pipe(switchMap((params: Params) => {
      this.visibility = 'hidden';
      return this.dishservice.getDish(+params['id']);
    }))
      .subscribe(dish => {
          this.dish = dish;
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        errmess => this.errMess = <any> errmess);
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {

    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      message: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  rate: number;

  pitch(event: any) {
    this.rate = event.value;
    console.log(event.value);
  }

  newComment: Comment;

  onSubmit() {

    this.dish.comments.push({
      rating: this.rate,
      comment: this.feedbackForm.get('message').value,
      author: this.feedbackForm.get('firstname').value,
      date: new Date().toDateString(),
    });
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
          this.dish = dish;
          this.dishcopy = dish;
        },
        errmess => {
          this.dish = null;
          this.dishcopy = null;
          this.errMess = <any> errmess;
        });
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      message: ''
    });

    this.feedbackFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
