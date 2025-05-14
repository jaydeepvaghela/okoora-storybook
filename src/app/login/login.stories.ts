import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { LoginComponent } from './login.component';
import { CodeVerificationComponent } from './code-verification/code-verification.component';

const meta: Meta<LoginComponent> = {
  title: 'User-authentication/Sign In/Login Form',
  component: LoginComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCheckboxModule,
        CodeVerificationComponent,
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
type Story = StoryObj<LoginComponent>;

export const Default: Story = {
  args: {
    loginForm: new FormBuilder().group({
      username: [''],
      password: [''],
      rememberMe: ['false'],
    })
  },
};
