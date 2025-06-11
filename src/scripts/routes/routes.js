import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import DetailPage from '../pages/detail/detail-page';
import AddPage from '../pages/add/add-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly, getLogout } from '../utils/auth';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/about': () => new AboutPage(),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/detail/:id': () => checkAuthenticatedRoute(new DetailPage()),
  '/logout': () => {
    getLogout();
    return null;
  },
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  notFound: () => new NotFoundPage(),
};

export default routes;
