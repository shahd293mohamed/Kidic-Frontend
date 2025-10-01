import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _auth=inject(Auth);
  const token = _auth.getToken(); 
  if(token){ 
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next(cloned);

  }

  return next(req);

};