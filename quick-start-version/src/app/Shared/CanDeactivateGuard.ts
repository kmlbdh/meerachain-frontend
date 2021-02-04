import { CanDeactivate } from '@angular/router/src/utils/preactivation';
import { Injectable } from '@angular/core';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate {
    component: Object;
    route: import("@angular/router").ActivatedRouteSnapshot;
    canDeactivate(component): boolean {

        if (component.hasUnsavedData()) {
            if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
}