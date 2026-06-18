import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = signal<string>('');
  loading = signal<boolean>(false);

  private auth = inject(AuthService);
  private router = inject(Router);

  submit(): void {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/book']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.status === 0
            ? 'Cannot reach the server. Make sure the backend is running.'
            : 'Invalid username or password.',
        );
      },
    });
  }
}
