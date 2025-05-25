import { getAccessToken } from './auth.js';

const initializeDrawer = () => {
    const drawerButton = document.getElementById('drawer-button');
    const navigationDrawer = document.getElementById('navigation-drawer');
    const navList = document.getElementById('nav-list');

    const updateNavMenu = () => {
        const isLoggedIn = !!getAccessToken();

        if (isLoggedIn) {
            navList.innerHTML = `
                <li><a href="#/">Beranda</a></li>
                <li><a href="#/add">Tambah Story</a></li>
                <li><a href="#/about">Tentang</a></li>
                <li><a href="#/logout" id="logout-button" class="logout-btn">Logout</a></li>
            `;
        } else {
            navList.innerHTML = `
                <li><a href="#/login">Login</a></li>
                <li><a href="#/register">Register</a></li>
                <li><a href="#/about">Tentang</a></li>
            `;
        }

        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navigationDrawer.classList.remove('open');
            });
        });
    };

    updateNavMenu();

    window.addEventListener('hashchange', updateNavMenu);

    drawerButton.addEventListener('click', (event) => {
        event.stopPropagation();
        navigationDrawer.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!navigationDrawer.contains(event.target) && !drawerButton.contains(event.target)) {
            navigationDrawer.classList.remove('open');
        }
    });
};

export default initializeDrawer;