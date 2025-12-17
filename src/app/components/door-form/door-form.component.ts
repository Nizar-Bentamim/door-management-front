import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DoorService } from '../../services/door.service';

@Component({
  selector: 'app-door-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './door-form.component.html',
  styleUrl: './door-form.component.css'
})
export class DoorFormComponent {
  doorForm: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private doorService: DoorService,
    private router: Router
  ) {
    this.doorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.doorForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      this.doorService.createDoor(this.doorForm.value).subscribe({
        next: () => {
          this.router.navigate(['/doors']);
        },
        error: (err: any) => {
          this.error.set(err.error?.message || 'Failed to create door. Please try again.');
          this.loading.set(false);
        }
      });
    } else {
      this.doorForm.markAllAsTouched();
    }
  }

  get name() {
    return this.doorForm.get('name');
  }

  get location() {
    return this.doorForm.get('location');
  }

  cancel() {
    this.router.navigate(['/doors']);
  }
}


