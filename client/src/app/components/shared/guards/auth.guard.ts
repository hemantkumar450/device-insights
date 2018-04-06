import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../../../core/shared/services/index';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private localStorageService: LocalStorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentUser = this.localStorageService.getCurrentUser();
        if (currentUser) {
            let returnUrl = state.url.split('/')[1];
            if (returnUrl) {
                this.localStorageService.setModuleName(returnUrl);
            }

            // this.router.navigate(['/dashboard']);
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
