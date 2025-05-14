import { Meta, moduleMetadata, StoryObj } from "@storybook/angular";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { ResetPasswordComponent } from "./reset-password.component";
import { CodeVerificationComponent } from "../code-verification/code-verification.component"; // standalone component
import { of } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

const fb = new FormBuilder();
const mockForm: FormGroup = fb.group({
  email: ['test@example.com']
});

const meta: Meta<ResetPasswordComponent> = {
  title: 'User-authentication/Sign In/Forgot Password',
  component: ResetPasswordComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTooltipModule,
        CodeVerificationComponent,
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<ResetPasswordComponent>;

export const ForgotPassword: Story = {
  args: {
    needVerification: false,
    resetPasswordForm: mockForm,
  },
};

export const CodeVerification: Story = {
  args: {
    needVerification: true,
    typeVerification: 'SMS',
    resetPasswordForm: mockForm,
  },
};
