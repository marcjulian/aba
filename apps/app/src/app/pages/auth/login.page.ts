import { Component, inject, input, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  submit,
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
  selector: 'abst-login',
  imports: [
    AuthLayout,
    FormField,
    RouterLink,
    HlmFieldImports,
    HlmButtonImports,
    HlmInputImports,
    HlmSpinnerImports,
  ],
  template: `
    <app-auth-layout>
      <form (submit)="login($event)">
        <hlm-field-group>
          <div class="flex flex-col items-center gap-1 text-center">
            <h1 class="text-2xl font-bold">Login to your account</h1>
            <p class="text-muted-foreground text-sm text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <hlm-field>
            <label hlmFieldLabel for="email">Email</label>
            <input
              hlmInput
              type="email"
              id="email"
              placeholder="m@example.com"
              autocomplete="username"
              [formField]="form.email"
            />
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
              autocomplete="current-password"
              [formField]="form.password"
            />
            @if (form.password().touched() && form.password().invalid()) {
              @for (error of form.password().errors(); track error) {
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
              Login
            </button>
            <p hlmFieldDescription class="text-center">
              Don't have an account?
              <a routerLink="/register">Sign up</a>
            </p>
          </hlm-field>
        </hlm-field-group>
      </form>
    </app-auth-layout>
  `,
})
export class LoginPage {
  private router = inject(Router);
  private authClient = injectAuthClient();

  readonly redirect = input<string, string | undefined>(
    environment.defaultRedirect,
    {
      transform: (value) => value || environment.defaultRedirect,
    },
  );

  private model = signal({
    email: '',
    password: '',
  });

  form = form(this.model, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email address' });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password must be at least 8 characters long',
    });
    maxLength(schemaPath.password, 128, {
      message: 'Password cannot be more than 128 characters long',
    });
  });

  loading = signal(false);

  async login(event: Event) {
    event.preventDefault();

    submit(this.form, async () => {
      const loginData = this.model();

      const { error } = await this.authClient.signIn.email({
        email: loginData.email,
        password: loginData.password,
        callbackURL: this.redirect(),
      });

      if (error) {
        toast.error(error?.message || 'Login failed');
      }
    });
  }
}
