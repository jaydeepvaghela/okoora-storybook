import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ChangePasswordComponent } from './change-password.component';

const meta: Meta<ChangePasswordComponent> = {
  title: 'User-authentication/Sign In/Change Password',
  component: ChangePasswordComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => null,
              },
              queryParamMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ChangePasswordComponent>;

export const Default: Story = {
  args: {
    resetPasswordForm: new FormBuilder().group({
      newPassword: [''],
      confirmPassword: [''],
    }),
    hasEight: false,
    hasDigit: false,
    hasLower: false,
    hasUpper: false,
    hasSpecial: false
  },
};
