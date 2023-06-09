import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PasswordService } from './password.service';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-password',
  templateUrl: './password.component.html',
  styleUrls: ['../register/register.component.css'],
})
export class PasswordComponent implements OnInit {
  errorMessage: any;
  doNotMatch = false;
  error = false;
  success = false;
  account$?: Observable<Account | null>;
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')],
    }),
  });

  constructor(private passwordService: PasswordService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.account$ = this.accountService.identity();
  }

  changePassword(): void {
    this.error = false;
    this.success = false;
    this.doNotMatch = false;

    const { newPassword, confirmPassword, currentPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.passwordService.save(newPassword, currentPassword).subscribe({
        next: () => {
          Swal.fire({
            title: 'Cambio exitoso',
            text: 'Se cambió exitosamente la contraseña.',
            // type: 'success',
            icon: 'success',
            confirmButtonColor: '#3381f6',
            confirmButtonText: 'Cerrar',
          }),
            (this.success = true);
        },
        error: () => {
          if (this.doNotMatch) {
            this.errorMessage = 'The password and its confirmation do not match!';
          } else if (this.error) {
            this.errorMessage = 'The password could not be changed.';
          }
          console.log(this.errorMessage);
          Swal.fire({
            title: 'Error',
            text: this.errorMessage,
            // type: 'error',
            icon: 'error',
            confirmButtonColor: '#3381f6',
            confirmButtonText: 'Cerrar',
          });
        },
      });
    }
  }
}
