import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({ selector: 'app-admin', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './admin.component.html', styleUrls: ['./admin.component.scss'] })
export class AdminComponent implements OnInit {
  section = 'dashboard';
  restaurants: any[] = [];
  users: any[] = [];
  pending: any[] = [];
  items: any[] = [];
  products: any[] = [];
  selectedId = '';
  message = ''; error = '';
  search = '';

  form: any = { restaurantName: '', currency: 'INR', imageUrl: '' };
  selectedProduct?: number;
  editingUser: any = null;
  editForm: any = {};

  constructor(private api: AdminService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.section = this.route.snapshot.data['section'] || 'dashboard';
      this.selectedId = p.get('restaurantId') || '';
      this.load();
    });
  }

  load() {
    this.error = '';
    if (this.section === 'dashboard' || this.section === 'restaurants')

      this.api.restaurants().subscribe({
        next: x => this.restaurants = x,
        error: () => this.error = 'Unable to load restaurants'
      });
    if (this.section === 'dashboard' || this.section === 'users')

      this.api.users().subscribe(x => this.users = x);

    if ((this.section === 'pending-admins' || this.section === 'dashboard') && this.isSuperAdmin()) this.api.pendingAdmins().subscribe(x => this.pending = x); if (this.section === 'items' && this.selectedId) { this.api.items(this.selectedId).subscribe(x => this.items = x); this.api.products().subscribe(x => this.products = x); }
  }


  isSuperAdmin() {
    try {
      return String(JSON.parse(localStorage.getItem('user') || '{}').role || '').replace(/[^a-z0-9]/gi, '').toUpperCase() === 'SUPERADMIN';
    }
    catch {
      return false;
    }
  }

  create() {
    this.api.createRestaurant(this.form).subscribe(
      {
        next: r => {
          this.message = 'Restaurant created successfully';
          this.form = {
            restaurantName: '',
            currency: 'INR',
            imageUrl: ''
          };

          this.router.navigate(['/admin/restaurants']);
        },

        error: () => this.error = 'Unable to create restaurant'
      });
  }

  addItem() {
    if (this.selectedProduct == null) return;

    this.api.addItem(this.selectedId, this.selectedProduct).subscribe(
      {
        next: () => {
          this.message = 'Item mapped successfully';
          this.load();
        }, error: () => this.error = 'Unable to map item'
      });
  }

  remove(item: any) {
    this.api.removeItem(this.selectedId, item.id).subscribe(() =>
      this.load());
  }

  approve(user: any) {
    this.api.approveAdmin(user.id).subscribe(() => {
      this.pending = this.pending.filter(x => x.id !== user.id);
      this.message = 'Admin approved successfully';
    });
  }

  get filteredUsers() {
    return this.users.filter(u => `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(this.search.toLowerCase()));
  }

  editUser(user: any) {
    this.editingUser = user;
    this.editForm = { ...user };
  }

  closeEditor() {
    this.editingUser = null;
  }
  saveUser() {
    this.api.updateUser(this.editForm.id, this.editForm).subscribe({
      next: updated => {
        Object.assign(this.editingUser, updated);
        this.message = 'User updated successfully';
        this.closeEditor();
      }, error: () => this.error = 'Unable to update user'
    });
  }

  deleteUser(user: any) {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    this.api.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(x => x.id !== user.id);
        this.message = 'User deleted successfully';
      }, error: () => this.error = 'Unable to delete user'
    });
  }
}
