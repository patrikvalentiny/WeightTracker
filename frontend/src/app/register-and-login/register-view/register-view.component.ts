import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
    selector: 'app-register-view',
    templateUrl: './register-view.component.html',
    styleUrls: ['./register-view.component.css']
})
export class RegisterViewComponent implements OnInit {
    passwordMatching: boolean = true;
    private readonly accountService: AccountService = inject(AccountService);
    private readonly fb: FormBuilder = inject(FormBuilder);
    private readonly toastService = inject(HotToastService);
    registerForm = this.fb.group({
        username: [null, Validators.required],
        password: [null, Validators.required, Validators.minLength(4)],
        confirmPassword: [null, Validators.required, Validators.minLength(4)],
        email: [null, Validators.email],
        firstName: [null],
        lastName: [null],
    });

    register() {
        if (this.registerForm.value.confirmPassword !== this.registerForm.value.password) {
            this.passwordMatching = false;
            this.registerForm.controls.confirmPassword.reset();
            this.toastService.error("Passwords do not match");
            return
        }

        this.accountService.register(this.registerForm);

    }

    ngOnInit(): void {

    }
}
