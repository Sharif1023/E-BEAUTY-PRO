import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  // Parent Categories
  { id: 'cat-makeup', name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-nails', name: 'Nail Care', slug: 'nail-care', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-hair', name: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1527799822394-46a85583795b?q=80&w=800&auto=format&fit=crop' },
  { id: 'cat-fragrance', name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop' },
  
  // Subcategories - Makeup
  { id: 'sub-fnd', name: 'Foundation', slug: 'foundation', image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-bbcc', name: 'BB Cream / CC Cream', slug: 'bb-cc-cream', image: 'https://images.unsplash.com/photo-1617224151703-99753e1a82da?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-comp', name: 'Compact Powder', slug: 'compact-powder', image: 'https://images.unsplash.com/photo-1590156206657-b01633f8152e?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-lp', name: 'Loose Powder', slug: 'loose-powder', image: 'https://images.unsplash.com/photo-1522338140262-f46f591261c8?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-conc', name: 'Concealer', slug: 'concealer', image: 'https://images.unsplash.com/photo-1617224021273-04021380963d?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-prm', name: 'Primer', slug: 'primer', image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-high', name: 'Highlighter', slug: 'highlighter', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-blsh', name: 'Blush', slug: 'blush', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-brnz', name: 'Bronzer', slug: 'bronzer', image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-kajl', name: 'Kajal / Kohl', slug: 'kajal-kohl', image: 'https://images.unsplash.com/photo-1631214499551-778918231362?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-eyel', name: 'Eyeliner', slug: 'eyeliner', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-masc', name: 'Mascara', slug: 'mascara', image: 'https://images.unsplash.com/photo-1631214548472-74d623267d34?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-eshd', name: 'Eye Shadow', slug: 'eye-shadow', image: 'https://images.unsplash.com/photo-1583241475880-083f84372725?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-ebrow', name: 'Eye Brow Pencil / Gel', slug: 'eye-brow', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-flsh', name: 'False Eyelashes', slug: 'false-eyelashes', image: 'https://images.unsplash.com/photo-1583241475880-083f84372725?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-lstk', name: 'Lipstick', slug: 'lipstick', image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-llstk', name: 'Liquid Lipstick', slug: 'liquid-lipstick', image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-lgls', name: 'Lip Gloss', slug: 'lip-gloss', image: 'https://images.unsplash.com/photo-1621235316335-e6a8d0f19c1e?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-llnr', name: 'Lip Liner', slug: 'lip-liner', image: 'https://images.unsplash.com/photo-1621235316335-e6a8d0f19c1e?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-lbalm', name: 'Lip Balm', slug: 'lip-balm', image: 'https://images.unsplash.com/photo-1621235316335-e6a8d0f19c1e?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },
  { id: 'sub-ltnt', name: 'Lip Tint', slug: 'lip-tint', image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=400&auto=format&fit=crop', parentId: 'cat-makeup' },

  // Subcategories - Skincare
  { id: 'sub-fwash', name: 'Face Wash / Cleanser', slug: 'face-wash', image: 'https://images.unsplash.com/photo-1626285495532-49f972403168?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-toner', name: 'Toner', slug: 'toner', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-serum', name: 'Serum', slug: 'serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-moist', name: 'Moisturizer', slug: 'moisturizer', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-sun', name: 'Sunscreen', slug: 'sunscreen', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-mask', name: 'Face Mask / Face Pack', slug: 'face-mask', image: 'https://images.unsplash.com/photo-1626285495532-49f972403168?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },
  { id: 'sub-scrb', name: 'Scrub / Exfoliator', slug: 'scrub', image: 'https://images.unsplash.com/photo-1626285495532-49f972403168?q=80&w=400&auto=format&fit=crop', parentId: 'cat-skincare' },

  // Subcategories - Nails
  { id: 'sub-npol', name: 'Nail Polish', slug: 'nail-polish', image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=400&auto=format&fit=crop', parentId: 'cat-nails' },
  { id: 'sub-nrem', name: 'Nail Remover', slug: 'nail-remover', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400&auto=format&fit=crop', parentId: 'cat-nails' },
  { id: 'sub-base', name: 'Base Coat', slug: 'base-coat', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=400&auto=format&fit=crop', parentId: 'cat-nails' },
  { id: 'sub-top', name: 'Top Coat', slug: 'top-coat', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=400&auto=format&fit=crop', parentId: 'cat-nails' },
  { id: 'sub-hard', name: 'Nail Hardener', slug: 'nail-hardener', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400&auto=format&fit=crop', parentId: 'cat-nails' },

  // Subcategories - Hair Care
  { id: 'sub-shamp', name: 'Shampoo', slug: 'shampoo', image: 'https://images.unsplash.com/photo-1584297062300-24422e17326b?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },
  { id: 'sub-cond', name: 'Conditioner', slug: 'conditioner', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },
  { id: 'sub-hserum', name: 'Hair Serum', slug: 'hair-serum', image: 'https://images.unsplash.com/photo-1527799822394-46a85583795b?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },
  { id: 'sub-hoil', name: 'Hair Oil', slug: 'hair-oil', image: 'https://images.unsplash.com/photo-1527799822394-46a85583795b?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },
  { id: 'sub-hmask', name: 'Hair Mask', slug: 'hair-mask', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },
  { id: 'sub-hspray', name: 'Hair Spray', slug: 'hair-spray', image: 'https://images.unsplash.com/photo-1527799822394-46a85583795b?q=80&w=400&auto=format&fit=crop', parentId: 'cat-hair' },

  // Subcategories - Fragrance
  { id: 'sub-perf', name: 'Perfume', slug: 'perfume', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop', parentId: 'cat-fragrance' },
  { id: 'sub-bmist', name: 'Body Mist', slug: 'body-mist', image: 'https://images.unsplash.com/photo-1544467316-e97029d2fdaa?q=80&w=400&auto=format&fit=crop', parentId: 'cat-fragrance' },
  { id: 'sub-deod', name: 'Deodorant', slug: 'deodorant', image: 'https://images.unsplash.com/photo-1544467316-e97029d2fdaa?q=80&w=400&auto=format&fit=crop', parentId: 'cat-fragrance' },
];

export const PRODUCTS: Product[] = [
  // Makeup
  {
    id: 'p1',
    name: 'Silk Glow HD Foundation',
    description: 'A breathable, medium-to-full coverage foundation that gives a natural skin-like finish.',
    price: 45.00,
    category: 'Makeup',
    subCategory: 'Foundation',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=600&h=600&auto=format&fit=crop',
    stock: 40,
    rating: 4.8,
    reviews: 210,
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Matte Velvet Liquid Lipstick',
    description: 'Ultra-pigmented liquid lipstick that lasts for 12 hours without drying your lips.',
    price: 24.00,
    category: 'Makeup',
    subCategory: 'Liquid Lipstick',
    image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=600&h=600&auto=format&fit=crop',
    stock: 120,
    rating: 4.6,
    reviews: 154
  },
  {
    id: 'p3',
    name: 'Volume Extreme Mascara',
    description: 'Instantly lifts and volumizes every lash with a jet-black, clump-free formula.',
    price: 18.00,
    category: 'Makeup',
    subCategory: 'Mascara',
    image: 'https://images.unsplash.com/photo-1631214499551-778918231362?q=80&w=600&h=600&auto=format&fit=crop',
    stock: 85,
    rating: 4.7,
    reviews: 98,
    isFeatured: true
  },
  // Skincare
  {
    id: 'p5',
    name: 'Vitamin C Brightening Serum',
    description: 'Highly concentrated serum that targets dark spots and uneven skin tone.',
    price: 55.00,
    category: 'Skincare',
    subCategory: 'Serum',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&h=600&auto=format&fit=crop',
    stock: 30,
    rating: 4.8,
    reviews: 124,
    isFeatured: true
  },
  {
    id: 'p12',
    name: 'Midnight Jasmine Eau de Parfum',
    description: 'A seductive blend of white jasmine, amber, and vanilla musk.',
    price: 95.00,
    category: 'Fragrance',
    subCategory: 'Perfume',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&h=600&auto=format&fit=crop',
    stock: 15,
    rating: 4.9,
    reviews: 45,
    isFeatured: true
  }
];