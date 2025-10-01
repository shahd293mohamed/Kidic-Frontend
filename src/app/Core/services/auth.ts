import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Ilogin, IloginRes, DecodedToken } from '../model';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _activeRoute: ActivatedRoute
  ) {}

  private isAuth = new BehaviorSubject<DecodedToken | null>(this.islogedin());
  public isAuth$ = this.isAuth.asObservable();

  private url = 'http://localhost:8080/api/auth';
  private token_key = 'token';

  initAuth() {
    const user = this.islogedin();
    this.isAuth.next(user);  
  }

  login(data: Ilogin) {
    return this._http.post<IloginRes>(`${this.url}/login`, data).pipe(
      tap(res => {
        const token = res.token;
        if (token) {
          this.storeToken(token);
        }

        const decode = this.decodeToken(token);
        this.isAuth.next(decode);

        if (decode) {
          if (decode.family_id) {
          this._router.navigate(['/dashboard/main']);
        } else {
          this._router.navigate(['/']);
        }
        }
      })
    );
  }

  signupNewFamily(userData: any): Observable<any> {
    return this._http.post(`${this.url}/signup/new-family`, userData);
  }


  signupExistingFamily(userData: any): Observable<any> {
    return this._http.post(`${this.url}/signup/existing-family`, userData);
  }

  logout() {
    localStorage.removeItem(this.token_key);
    this.isAuth.next(null);

    const routes = this._router.config;
    const currentUrl = this._router.url;
    const isSecure = this.isSecureRoute(currentUrl, routes);

    if (isSecure) {
      this._router.navigate(['/']);
    }
  }

  private isSecureRoute(url: string, routes: Routes): boolean {
    for (const myRoute of routes) {
      if (url.startsWith('/' + myRoute.path)) {
        if (myRoute.canActivate?.length) {
          return true;
        }
        if (myRoute.children) {
          return this.isSecureRoute(url, myRoute.children);
        }
      }
    }
    return false;
  }

  private decodeToken(token: string): DecodedToken | null {
  try {
    const decode = jwtDecode<any>(token);
    console.log("Decoded Token:", decode); 

    if (!decode) return null;

    if (decode.exp) {
      const expiry = decode.exp * 1000;
      if (Date.now() < expiry) {
        return decode;
      }
    }
    return null;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}


  private storeToken(token: string) {
    localStorage.setItem(this.token_key, token);
  }

  getToken() {
    return localStorage.getItem(this.token_key);
  }

  islogedin(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      const decode = this.decodeToken(token);
      if (decode) {
        return decode;
      }
    }
    return null;
  }

  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

getFamilyId(): string | null {
  const decoded = this.islogedin();
  if (decoded?.family_id) {
    return decoded.family_id;
  }
  return null;
}
}
