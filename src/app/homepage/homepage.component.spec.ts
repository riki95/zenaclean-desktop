import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponent } from './homepage.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import config from '../../../config.secret';
import {HttpClientModule} from '@angular/common/http';
import {SignupFormComponent} from '../signup-form/signup-form.component';
import {ReportsBoardComponent} from '../reports-board/reports-board.component';
import {ReportsListComponent} from '../reports-list/reports-list.component';
import {MapComponent} from '../map/map.component';
import {ProfileComponent} from '../profile/profile.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {LogoutComponent} from '../logout/logout.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          HomepageComponent,
          SignupFormComponent,
          ReportsBoardComponent,
          ReportsListComponent,
          MapComponent,
          ProfileComponent,
          AutocompleteComponent,
          LogoutComponent
      ],
        imports: [
            BrowserModule,
            NgbModule,
            FormsModule,
            ReactiveFormsModule,
            AgmCoreModule.forRoot({
                apiKey: config.googleMapsApiKey,
            }),
            HttpClientModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
