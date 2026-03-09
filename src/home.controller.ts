import { Controller, Get, Render, Req } from '@nestjs/common';

interface ProductCard {
  title: string;
  price: string;
  image: string;
}

@Controller()
export class HomeController {

  @Get()
  @Render('home')
  root(@Req() req) {
    const isAuthenticated = Boolean(req.session?.user);
    const products: ProductCard[] = [
      { title: 'Pearl Earrings', price: '$59', image: '/assests/imgs/item1.webp' },
      {
        title: 'Classic Bracelet',
        price: '$79',
        image: '/assests/imgs/Classic Bracelet.webp',
      },
      { title: 'Elegant Ring', price: '$49', image: '/assests/imgs/item3.webp' },
    ];

    return {
      pageTitle: 'Web Backend Lab 1',
      isAuthenticated,
      userName: isAuthenticated ? req.session.user : null,
      menuItems: [
        { label: 'Home', href: '/' },
        { label: 'Catalog', href: '/list.html' },
        { label: 'Categories', href: '/category.html' },
        { label: 'Cart', href: '/cart.html' },
      ],
      products,
    };
  }
}