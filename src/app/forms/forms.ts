import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {
  validateNotTaken,
  patternValidator,
} from '../validators/custom.validator';
import { DataService } from '../services/data-service/data.service';
import { AuthService } from '../services/auth-service/auth.service';
import { SubSink } from 'subsink';
import { IUser } from '../interfaces/User';
import { OnInit, OnDestroy } from '@angular/core';

export class SignUp implements OnInit, OnDestroy {
  subscriptions = new SubSink();
  allUsersArray: IUser[];

  constructor(private _data: DataService, private _auth: AuthService) {}

  ngOnInit(): void {
    this.setAllUsers();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setAllUsers() {
    this.subscriptions.sink = this._data.allUsersArray$.subscribe(
      (getAllUsersResponse) => {
        console.log(getAllUsersResponse);
        this.allUsersArray = getAllUsersResponse;
      }
    );
  }

  public static SignUpForm(allUsersArray) {
    console.log('Creating SignUp Form and All User Data is' + allUsersArray);
    let signUpForm = new FormBuilder().group({
      id: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ],
        validateNotTaken(allUsersArray).bind(this),
      ],
      first_name: [''],
      last_name: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$'
          ),
        ],
        validateNotTaken(allUsersArray).bind(this),
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}'
          ),
          patternValidator(/\d/, { hasNumber: true }),
          patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          patternValidator(/[a-z]/, { hasSmallCase: true }),
        ],
      ],
    });
    return signUpForm;
  }
}
