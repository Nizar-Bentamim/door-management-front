import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoorService, Door } from '../../services/door.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-door-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './door-list.component.html',
  styleUrl: './door-list.component.css'
})
export class DoorListComponent implements OnInit {
  doors = signal<Door[]>([]);
  filteredDoors = signal<Door[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchTerm = signal('');
  currentPage = signal(1);
  itemsPerPage = 10;

  constructor(private doorService: DoorService) {}

  ngOnInit() {
    this.loadDoors();
  }

  loadDoors() {
    this.loading.set(true);
    this.error.set(null);
    this.doorService.getAllDoors().subscribe({
      next: (doors) => {
        this.doors.set(doors);
        this.filteredDoors.set(doors);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load doors. Please try again.');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.filterDoors();
  }

  filterDoors() {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      this.filteredDoors.set(this.doors());
    } else {
      const filtered = this.doors().filter(door =>
        door.name.toLowerCase().includes(term) ||
        door.location.toLowerCase().includes(term)
      );
      this.filteredDoors.set(filtered);
    }
  }

  get paginatedDoors() {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDoors().slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredDoors().length / this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }
}


