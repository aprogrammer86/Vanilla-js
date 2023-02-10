"use strict";

import { printToConsole } from './shared.js';
import { injectContent } from './pages/product.js';
import { injectContent3 } from './pages/category.js';

const mainContent = document.querySelector('#content-area');


document.querySelectorAll('.menu-item').forEach(item => item.addEventListener('click', () => {
    const active = document.querySelector('.menu-item-active');

    if (active !== null)
        active.classList.remove('menu-item-active');

    item.classList.add('menu-item-active')

}))


document.querySelectorAll('.menu-item').forEach(item => item.addEventListener('mouseover', () => {
    const prvHover = document.querySelector('.menu-item-hover');
    if (prvHover !== null) {
        prvHover.classList.remove('menu-item-hover');
    }

    if (!item.classList.contains('menu-item-active')) {
        item.classList.add('menu-item-hover');
    }

}))


document.querySelectorAll('.menu-item').forEach(item => item.addEventListener('mouseout', () => {
    const prvHover = document.querySelector('.menu-item-hover');
    if (prvHover !== null) {
        prvHover.classList.remove('menu-item-hover');
    }

}))

const router = () => {
    const routes = [
        { path: '/', view: (place) => injectContent(place) },
        { path: '/category', view: (place) => injectContent3(place) }
    ];
    // const routes = [
    //     { path: '/', view: () => printToConsole('/') },
    //     { path: '/category', view: () => printToConsole('/category')}
    // ];

    const checkRoutes = routes.map(item => {
        return {
            route: item,
            isMatch: location.pathname === item.path
        };
    });

    let matchedRoute = checkRoutes.find(item => item.isMatch);

    if (!matchedRoute) {
        matchedRoute = {
            route: routes[0],
            isMatch: true
        };
    }

    printToConsole(matchedRoute.route.path);

    return matchedRoute.route;
}

const navTo = (url) => {
    printToConsole('navTo')

    history.pushState(null, null, url);

    const result = router();

    mainContent.innerHTML = '';
    result.view(mainContent);
}


const initPage = () => {
    printToConsole('initPage');

    document.body.addEventListener('click', (e) => {
        // e.preventDefault();
        // printToConsole(e.target)
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navTo(e.target.href)
        }
    });

    navTo('/');
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', initPage);