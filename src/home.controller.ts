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
      { title: 'Pearl Earrings', price: '$59', image: '/assets/imgs/item1.webp' },
      {
        title: 'Classic Bracelet',
        price: '$79',
        image: '/assets/imgs/Classic Bracelet.webp',
      },
      { title: 'Elegant Ring', price: '$49', image: '/assets/imgs/item3.webp' },
    ];

    return {
      pageTitle: 'Web cua Hang Ly',
      isAuthenticated,
      userName: isAuthenticated ? req.session.user : ' ',
      menuItems: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Brands', href: '/brands' },
        { label: 'Categories', href: '/categories' },
        { label: 'Orders', href: '/orders' },
      ],
      products,
    };
  }
}