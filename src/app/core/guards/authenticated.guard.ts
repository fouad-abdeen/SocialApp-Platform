import axios from 'axios';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@env/environment';

// This guard is used to prevent unauthenticated users from accessing private routes
export const authenticatedGuard: CanActivateFn = async (route, state) => {
  const router = new Router();

  if (localStorage) {
    const userExpiresAt = JSON.parse(
      localStorage.getItem('userExpiresAt') ?? 'false'
    );

    if (userExpiresAt > Date.now()) {
      const user = localStorage.getItem('user');
      if (user) return true;
    }
  }

  try {
    const response = await axios.get(`${environment.serverUrl}/auth/user`, {
      withCredentials: true,
    });

    if (response.data) {
      if (localStorage) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        // Set userExpiresAt to 3 minutes from now
        localStorage.setItem(
          'userExpiresAt',
          JSON.stringify(Date.now() + 180000)
        );
      }

      return true;
    }
  } catch (error) {
    localStorage.removeItem('user');
    localStorage.removeItem('userExpiresAt');
  }

  return router.parseUrl('/');
};
