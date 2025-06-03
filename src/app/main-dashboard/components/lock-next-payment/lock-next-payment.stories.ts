import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { LockNextPaymentComponent } from './lock-next-payment.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

const mockRateData = {
  previousPaymentRate: 2.299963,
  currentPaymentRate: 2.372,
  percentages: 3.13,
  direction: 1, // 1 = Up
  buySell: 1,
};

const Directions = {
    Down: 1,
    Up: 2
} 

export default {
  title: 'Main Dashboard/Fourth Row Sections/Lock Next Payment Slides',
  component: LockNextPaymentComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatDialogModule],
    }),
  ],
  args: {
    lastPaymentRateData: mockRateData,
    Directions: Directions,
  },
} as Meta<LockNextPaymentComponent>;

type Story = StoryObj<LockNextPaymentComponent>;

export const PayNowSlide: Story = {
  render: (args) => ({
    props: args,
    template: `
        <style>
        .swiper-slide {
            height: initial !important;
            // box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
        }
        @media screen and (max-width: 1440px) {
          .swiper-slide {
            min-width: 230px;
            max-width: 250px;
          }
        }
        .pay-now-card-img {
          max-width: 150px;
        }
        
        .lock-and-pay-card {
            border: none;
            padding: 20px 0;
            max-width: 356px;
            min-height: 450px;
            box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
            
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card {
                min-width: 185px;
                min-height: 448px;
            }
        }
        @media screen and (min-width: 1601px) {
            .lock-and-pay-card {
                min-height: 460px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card {
                height: 400px;
            }
        }
        .lock-and-pay-card .card-body {
            text-align: center;
        }
        .lock-and-pay-card .card-body .slide-badge {
            min-height: 27px;
            margin: 25px 0;
            border-radius: 3px;
            overflow: hidden;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
            background: #45ae4a;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up img {
            width: 18px;
            height: auto;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
            background: #f04853;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down img {
            width: 18px;
            height: auto;
            transform: rotate(180deg);
        }
        .lock-and-pay-card .card-body .lock-and-pay-btn {
            border: 2px solid var(--brand-primary-color);
            width: 12rem;
            border-radius: 40px;
            margin: 0 auto;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: var(--brand-primary-color);
            padding: 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .lock-and-pay-btn {
                font-size: 14px;
                width: 10rem;
                padding: 5px;
            }
        }
        .lock-and-pay-card .card-body .card-title {
            font-weight: 700;
            font-size: 20px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-title {
                font-size: 18px;
            }
        }
        .lock-and-pay-card .card-body .card-text {
            color: #a3a5aa;
            font-size: 14px;
            margin-bottom: 10px;
            font-family: 'Manrope';
            letter-spacing: 1px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-text {
                font-size: 12px;
            }
        }
        


      </style>
      <div class="swiper-slide">
        <div class="card lock-and-pay-card">
          <div class="card-body d-flex flex-column align-items-center">
            <label class="slide-badge">
              <span [ngClass]="lastPaymentRateData?.direction == Directions.Up ? 'arrow-value-up' : 'arrow-value-down'">
                {{ lastPaymentRateData?.currentPaymentRate | number : '1.0-4' }}
                <img src="images/lock-up-arrow.svg"/>
              </span>
            </label>
            <h5 class="card-title">Pay Now</h5>
            <p class="card-text">Save more, Pay now and Maximize savings!</p>
            <div class="mt-auto text-center">
              <img class="pay-now-card-img" id="pay-now-img" src="images/pay-now-icon.svg" alt="pay-now" />
            </div>
            <div class="mt-2">
              <button class="lock-and-pay-btn" id="pay-now-btn" (click)="onPayNowClick()">Pay Now</button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const LockAndPayLaterSlide: Story = {
  render: (args) => ({
    props: args,
    template: `
    <style>
        .swiper-slide {
            height: initial !important;
            // box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
        }
        @media screen and (max-width: 1440px) {
          .swiper-slide {
            min-width: 230px;
            max-width: 250px;
          }
        }
        .pay-now-card-img {
          max-width: 150px;
        }

        .lock-and-pay-card {
            border: none;
            padding: 20px 0;
            max-width: 356px;
            min-height: 450px;
            box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card {
                min-width: 185px;
                min-height: 448px;
            }
        }
        @media screen and (min-width: 1601px) {
            .lock-and-pay-card {
                min-height: 460px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card {
                height: 400px;
            }
        }
        .lock-and-pay-card .card-body {
            text-align: center;
        }
        .lock-and-pay-card .card-body .slide-badge {
            min-height: 27px;
            margin: 25px 0;
            border-radius: 3px;
            overflow: hidden;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
            background: #45ae4a;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up img {
            width: 18px;
            height: auto;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
            background: #f04853;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down img {
            width: 18px;
            height: auto;
            transform: rotate(180deg);
        }
        .lock-and-pay-card .card-body .lock-and-pay-btn {
            border: 2px solid var(--brand-primary-color);
            width: 12rem;
            border-radius: 40px;
            margin: 0 auto;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: var(--brand-primary-color);
            padding: 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .lock-and-pay-btn {
                font-size: 14px;
                width: 10rem;
                padding: 5px;
            }
        }
        .lock-and-pay-card .card-body .card-title {
            font-weight: 700;
            font-size: 20px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-title {
                font-size: 18px;
            }
        }
        .lock-and-pay-card .card-body .card-text {
            color: #a3a5aa;
            font-size: 14px;
            margin-bottom: 10px;
            font-family: 'Manrope';
            letter-spacing: 1px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-text {
                font-size: 12px;
            }
        }
 
      </style>
      <div class="swiper-slide">
        <div class="card lock-and-pay-card">
          <div class="card-body d-flex flex-column align-items-center">
            <label class="slide-badge">
              <span id="current-lockPayRate" [ngClass]="lastPaymentRateData?.direction == Directions.Up ? 'arrow-value-up' : 'arrow-value-down'">
                {{lastPaymentRateData?.currentPaymentRate | number : '1.0-4' }}
                <img src="images/lock-up-arrow.svg" />
              </span>
            </label>
            <h5 class="card-title">Lock & Pay later</h5>
            <p class="card-text">Save more, Lock your rate and Maximize Savings!</p>
            <div class="mt-auto text-center">
              <img class="mb-3" src="images/lockandpay-later-icon.svg" alt="lock-and-pay-later" />
            </div>
            <div class="mt-2">
              <button class="lock-and-pay-btn" id="lock-pay-slide-openDialog" (click)="CreateLockRateDialog()">Lock Rate</button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const AlertRateSlide: Story = {
  render: (args) => ({
    props: args,
    template: `
    <style>
        .swiper-slide {
            height: initial !important;
            // box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
        }
        @media screen and (max-width: 1440px) {
          .swiper-slide {
            min-width: 230px;
            max-width: 250px;
          }
        }
        .pay-now-card-img {
          max-width: 150px;
        }

        .lock-and-pay-card {
            border: none;
            padding: 20px 0;
            max-width: 356px;
            min-height: 450px;
            box-shadow: 0 2px 1px -1px #0003, 0 1px 1px #00000024, 0 1px 3px #0000001f;
            
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card {
                min-width: 185px;
                min-height: 448px;
            }
        }
        @media screen and (min-width: 1601px) {
            .lock-and-pay-card {
                min-height: 460px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card {
                height: 400px;
            }
        }
        .lock-and-pay-card .card-body {
            text-align: center;
        }
        .lock-and-pay-card .card-body .slide-badge {
            min-height: 27px;
            margin: 25px 0;
            border-radius: 3px;
            overflow: hidden;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
            background: #45ae4a;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-up {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-up img {
            width: 18px;
            height: auto;
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
            background: #f04853;
            color: #fff;
            font-size: 15px;
            line-height: 18px;
            font-weight: 700;
            padding: 4px 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                font-size: 12px;
                padding: 2px 15px;
            }
        }
        @media screen and (max-width: 767px) {
            .lock-and-pay-card .card-body .slide-badge .arrow-value-down {
                margin: 0 0 25px 0;
            }
        }
        .lock-and-pay-card .card-body .slide-badge .arrow-value-down img {
            width: 18px;
            height: auto;
            transform: rotate(180deg);
        }
        .lock-and-pay-card .card-body .lock-and-pay-btn {
            border: 2px solid var(--brand-primary-color);
            width: 12rem;
            border-radius: 40px;
            margin: 0 auto;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: var(--brand-primary-color);
            padding: 10px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .lock-and-pay-btn {
                font-size: 14px;
                width: 10rem;
                padding: 5px;
            }
        }
        .lock-and-pay-card .card-body .card-title {
            font-weight: 700;
            font-size: 20px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-title {
                font-size: 18px;
            }
        }
        .lock-and-pay-card .card-body .card-text {
            color: #a3a5aa;
            font-size: 14px;
            margin-bottom: 10px;
            font-family: 'Manrope';
            letter-spacing: 1px;
        }
        @media screen and (max-width: 1440px) {
            .lock-and-pay-card .card-body .card-text {
                font-size: 12px;
            }
        }  
      </style>
      <div class="swiper-slide">
        <div class="card lock-and-pay-card">
          <div class="card-body d-flex flex-column align-items-center">
            <label class="slide-badge">
              <span *ngIf="lastPaymentRateData?.currentPaymentRate" [ngClass]="lastPaymentRateData?.direction == Directions.Up ? 'arrow-value-up' : 'arrow-value-down'">
                {{lastPaymentRateData?.currentPaymentRate | number : '1.0-4' }}
                <img src="images/lock-up-arrow.svg" id="lock-up-arrow" />
              </span>
            </label>
            <h5 class="card-title" id="card-title">Alert the Rate</h5>
            <p class="card-text" id="card-text">Stay Ahead, Pay Less: Set Alerts for Better Rates!</p>
            <div class="mt-auto text-center">
              <img class="mb-3" id="rate-alert-img" src="images/alert-rate-icon.svg" alt="rate-alert" />
            </div>
            <div class="mt-2">
              <button class="lock-and-pay-btn" id="alert-me-btn" (click)="CreateAlertDialog()">Alert Me</button>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
