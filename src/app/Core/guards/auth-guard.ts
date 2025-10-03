import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const authS = inject(Auth);
  const router= inject(Router);
  if(authS.isUserLoggedIn()===true){
    return true;
  }

  // return router.navigate(['/login']);
 return router.createUrlTree(['/signin', {queryParams: {returnUrl: state.url}}]);
};
