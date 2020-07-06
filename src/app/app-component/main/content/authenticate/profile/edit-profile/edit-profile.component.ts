import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { IUser } from 'src/app/app-interface/User';
import { IProfile } from 'src/app/app-interface/Profile';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/app-service/auth-service/auth.service';
import { DataService } from 'src/app/app-service/data-service/data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { isValid, isInValid } from 'src/app/app-validators/custom.validator';
import { timer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  isValid = isValid;
  isInValid = isInValid;
  subscriptions = new SubSink();
  profileForm = new FormBuilder().group({
    user: [this._data.loggedInUser.id],
    bio: ['', [Validators.maxLength(150)]],
    address: new FormBuilder().group({
      user: [this._data.loggedInUser],
      city: [''],
      state: [''],
      street: [''],
      zip_code: [''],
    }),
    birth_date: [null],
    email_confirmed: [false],
    image: [null],
  });

  value(controlName: string) {
    return this.profileForm.get(controlName);
  }

  constructor(
    private _auth: AuthService,
    private _data: DataService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.setUserProfile();
  }

  setUserProfile() {
    this.subscriptions.sink = this._data.userProfile$.subscribe(
      (profileResponse) => {
        console.log(profileResponse);
        profileResponse ? delete profileResponse.image : {};
        this.profileForm.patchValue(profileResponse ? profileResponse : {});
      }
    );
  }

  editProfile() {
    this.profileForm.removeControl('image');
    console.log(this.profileForm.value);
    this.subscriptions.sink = this._auth
      .EditProfile(this.profileForm.value)
      .subscribe(
        (editProfileResponse) => {
          console.log(editProfileResponse);
          this._data.userProfileSubject$.next(editProfileResponse);
          this._router.navigate(['/']);
        },
        (editProfileError) => {
          console.log(editProfileError);
        },
        () => {
          console.log('Edit profile Service called Successfully');
        }
      );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}