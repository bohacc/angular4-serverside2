import { Subscription }                                                from 'rxjs/Subscription'

import { AfterViewInit, Component, ChangeDetectionStrategy, Inject, 
         OnDestroy, OnInit, ViewEncapsulation, ViewChild }             from '@angular/core'
import { Router }                                                      from '@angular/router'
import { FormGroup, FormControl, Validators, FormBuilder }             from '@angular/forms'

import { MetaService, MetaDefinition, SliderComponent, SliderOptions } from '../../../shared'
import { AuthModelService }                                            from '../../'


@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.component.css']
})
export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(SliderComponent) private _slider: SliderComponent;

  public signupForm: FormGroup;
  public error: string;
  public loading: Boolean = false;
  public slides: any[] = [];
  public sliderOptions: SliderOptions = {};

  private _tokenSubscription: Subscription;
  private _errorSubscription: Subscription;
  private _metaArray: MetaDefinition[] = [];

  constructor(
    @Inject('isBrowser') private _isBrowser: Boolean,
    private _auth: AuthModelService,
    private _router: Router,
    private _meta: MetaService,
    private _fb: FormBuilder
  ) {
    this.signupForm = _fb.group({
      "email": ["", Validators.required],
      "password": ["", [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit(): void {
    this._metaArray = [
      { name: 'description', content: 'Set by meta setter service', id: 'desc' },
      // Twitter
      { name: 'twitter:title', content: 'Set by meta setter service' },
      // Google+
      { itemprop: 'name', content: 'Set by meta setter service' },
      { itemprop: 'description', content: 'Set by meta setter service' },
      // Facebook / Open Graph
      { property: 'fb:app_id', content: 'Set by meta setter service' },
      { property: 'og:title', content: 'Set by meta setter service' }
    ];
    this._meta.setTitle('Sign up');
    this._meta.addTags(this._metaArray);

    this.sliderOptions = {
      loop: true,
      autoplay: 8000,
      autoplayDisableOnInteraction: false,
      paginationClickable: true
    };

    this._tokenSubscription = this._auth.token$.subscribe(token => {
      this.loading = false;
      if (token) { this._router.navigate(['/discover']); }
    });

    this._errorSubscription = this._auth.error$.subscribe(error => this.error = error);

    this.slides = [
      "test",
      "test 2",
      "test 3"
    ];
  }

  ngOnDestroy(): void {
    this._tokenSubscription.unsubscribe();
    this._errorSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._initSlider());
  }

  signup(): void {
    var email: String = this.signupForm.controls['email'].value,
        password: String = this.signupForm.controls['password'].value;

    this.loading = true;

    this._auth.signup(email, password);
  }

  private _initSlider(): void {
    this._slider.initSlider();
  }
  
}