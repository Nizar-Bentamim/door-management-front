import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoorService, Door } from '../../services/door.service';
import { AccessService, Access } from '../../services/access.service';
import { UserService, User } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-door-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './door-detail.component.html',
  styleUrl: './door-detail.component.css'
})
export class DoorDetailComponent implements OnInit {
  door = signal<Door | null>(null);
  usersWithAccess = signal<Access[]>([]);
  allUsers = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showUserSelect = signal(false);
  selectedUserId = signal<number | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doorService: DoorService,
    private accessService: AccessService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const doorId = this.route.snapshot.paramMap.get('id');
    if (doorId) {
      this.loadDoor(Number(doorId));
      this.loadUsersWithAccess(Number(doorId));
      this.loadAllUsers();
    }
  }

  loadDoor(id: number) {
    this.loading.set(true);
    this.doorService.getDoorById(id).subscribe({
      next: (door) => {
        this.door.set(door);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load door details.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  loadUsersWithAccess(doorId: number) {
    this.doorService.getUsersByDoorId(doorId).subscribe({
      next: (accesses) => {
        this.usersWithAccess.set(accesses);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.allUsers.set(users);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getAvailableUsers() {
    const assignedUserIds = this.usersWithAccess().map(a => a.userId);
    return this.allUsers().filter(u => !assignedUserIds.includes(u.id));
  }

  toggleUserSelect() {
    this.showUserSelect.set(!this.showUserSelect());
  }

  onUserIdChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.selectedUserId.set(value ? Number(value) : null);
  }

  grantAccess() {
    const userId = this.selectedUserId();
    const doorId = this.door()?.id;
    
    if (!userId || !doorId) {
      this.error.set('Please select a user.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.accessService.grantAccess({ userId, doorId }).subscribe({
      next: () => {
        this.successMessage.set('Access granted successfully!');
        this.loadUsersWithAccess(doorId);
        this.showUserSelect.set(false);
        this.selectedUserId.set(null);
        this.loading.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Failed to grant access.');
        this.loading.set(false);
      }
    });
  }

  revokeAccess(userId: number) {
    const doorId = this.door()?.id;
    if (!doorId) return;

    if (!confirm('Are you sure you want to revoke access?')) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.accessService.revokeAccess({ userId, doorId }).subscribe({
      next: () => {
        this.successMessage.set('Access revoked successfully!');
        this.loadUsersWithAccess(doorId);
        this.loading.set(false);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err: any) => {
        this.error.set(err.error?.message || 'Failed to revoke access.');
        this.loading.set(false);
      }
    });
  }
}


