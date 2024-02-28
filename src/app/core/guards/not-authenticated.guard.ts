import axios from 'axios';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@env/environment';

// This guard is used to prevent authenticated users from accessing public routes
export const notAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const router = new Router();

  if (localStorage) {
    const userExpiresAt = JSON.parse(
      localStorage.getItem('userExpiresAt') ?? 'false'
    );

    if (userExpiresAt > Date.now()) {
      const user = localStorage.getItem('user');
      if (user) return router.parseUrl('/home');
    }
  }

  const { skipAuth } = router.getCurrentNavigation()?.extras.state ?? {};
  if (skipAuth) return true;

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

      return router.parseUrl('/home');
    }
  } catch (error) {
    localStorage.removeItem('user');
    localStorage.removeItem('userExpiresAt');
  }

  return true;
};
