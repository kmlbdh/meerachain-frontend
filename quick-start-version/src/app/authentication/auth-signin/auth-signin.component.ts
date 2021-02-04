import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthserverService } from 'src/app/Shared/Authentication/authserver.service';
import { AuthenticationService } from 'src/app/Shared/Authentication/authentication.service';
import { LoginModel } from 'src/app/Shared/Authentication/LoginModel';
import { CacheService } from 'src/app/Shared/Cacheing/cache.service';
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { PermissionsManagerService } from 'src/app/Shared/Permissions/permissions-manager.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  public LoginForm: FormGroup;

  constructor(private authserverService: AuthserverService, private navigationItem: NavigationItem, private authenticationService: AuthenticationService, private fbuilder: FormBuilder, private cacheService: CacheService, private permissionsManagerService: PermissionsManagerService) {

    this.LoginForm = this.fbuilder.group({
      "UserName": [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      "Password": [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    });
  }

  ngOnInit() {
  }

  login() {
    this.authserverService.Login
      (new LoginModel(this.LoginForm.value))
      .subscribe(c => {
        if (c["token"]) {
          localStorage.setItem("token", c["token"]);
          if (typeof c["permissions"] != 'undefined') {
            c["permissions"].group.policiesObject = JSON.parse(c["permissions"].group["policiesObject"])
            this.cacheService.setCacheAPI("permissions", c["permissions"]);
          }
          if (typeof c["userpicture"] != 'undefined') {
            localStorage.setItem("userpicture", "./attachment/" + c["userpicture"]);
          }
          this.authenticationService.redirectUserBasedRole();
        } else {
          alert(c);
        }
      },
        err => {
          if (err.status == 400) {
            alert(err.error.message);
          }
        });
  }

}
