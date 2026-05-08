import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  email,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { environment } from '../../../environments/environment';
import { injectAuthClient } from '../../auth/auth-client';
import { AuthLayout } from '../../layouts/auth.layout';

@Component({
  selector: 'abst-register',
  imports: [
    AuthLayout,
    FormField,
    RouterLink,
    HlmFieldImports,
    HlmButtonImports,
    HlmInputImports,
    HlmSpinnerImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout>
      <form (submit)="signup($event)">
        <hlm-field-group>
          <div class="flex flex-col items-center gap-1 text-center">
            <h1 class="text-2xl font-bold">Create your account</h1>
            <p class="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>
          <hlm-field>
            <label hlmFieldLabel for="name">Full Name</label>
            <input
              hlmInput
              type="text"
              id="name"
              placeholder="John Doe"
              autocomplete="name"
              [formField]="form.name"
            />
            @if (form.name().touched() && form.name().invalid()) {
              @for (error of form.name().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="email">Email</label>
            <input
              hlmInput
              type="email"
              id="email"
              placeholder="you@example.com"
              autocomplete="username"
              [formField]="form.email"
            />
            @if (!(form.email().touched() && form.email().invalid())) {
              <hlm-field-description>
                We'll use this to contact you. We will not share your email with
                anyone else.
              </hlm-field-description>
            }
            @if (form.email().touched() && form.email().invalid()) {
              @for (error of form.email().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="password">Password</label>
            <input
              hlmInput
              id="password"
              type="password"
              autocomplete="new-password"
              [formField]="form.password"
            />
            @if (!(form.password().touched() && form.password().invalid())) {
              <hlm-field-description>
                Must be at least 8 characters long.
              </hlm-field-description>
            }
            @if (form.password().touched() && form.password().invalid()) {
              @for (error of form.password().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </hlm-field>
          <hlm-field>
            <label hlmFieldLabel for="confirmPassword">Confirm Password</label>
            <input
              hlmInput
              type="password"
              id="confirmPassword"
              autocomplete="new-password"
              [formField]="form.confirmPassword"
            />
            @if (
              !(
                form.confirmPassword().touched() &&
                form.confirmPassword().invalid()
              )
            ) {
              <hlm-field-description>
                Please confirm your password.
              </hlm-field-description>
            }
            @if (
              form.confirmPassword().touched() &&
              form.confirmPassword().invalid()
            ) {
              @for (error of form.confirmPassword().errors(); track error) {
                <hlm-field-error>{{ error.message }}</hlm-field-error>
              }
            }
          </hlm-field>
          <hlm-field>
            <button
              hlmBtn
              type="submit"
              [disabled]="form().invalid() || loading()"
            >
              @if (loading()) {
                <hlm-spinner />
              }
              Create Account
            </button>

            <p hlmFieldDescription class="text-center">
              Already have an account?
              <a routerLink="/login">Sign in</a>
            </p>
          </hlm-field>
        </hlm-field-group>
      </form>
    </app-auth-layout>
  `,
})
export class RegisterPage {
  private authClient = injectAuthClient();
  private readonly router = inject(Router);

  readonly redirect = input<string, string | undefined>(
    environment.defaultRedirect,
    {
      transform: (value) => value || environment.defaultRedirect,
    },
  );

  model = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  form = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Full name is required' });

    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email address' });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password must be at least 8 characters long',
    });
    maxLength(schemaPath.password, 128, {
      message: 'Password cannot be more than 128 characters long',
    });

    required(schemaPath.confirmPassword, {
      message: 'Please confirm your password',
    });
    validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });

  loading = signal(false);

  async signup(event: Event) {
    event.preventDefault();

    submit(this.form, async () => {
      const signupData = this.model();

      const { data, error } = await this.authClient.signUp.email({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      if (error) {
        toast.error(error?.message || 'Sign up failed');
      } else if (data) {
        toast.success('Sign up successful');
        await this.authClient.useSession()().refetch();
        await this.router.navigateByUrl(this.redirect(), {
          replaceUrl: true,
        });
      }
    });
  }
}
