export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

const PRODUCTS_KEY = 'smart_shop_products';
const CART_KEY = 'smart_shop_cart';
const PRODUCTS_VERSION_KEY = 'smart_shop_products_version';
const CURRENT_VERSION = '2';

const defaultProducts: Product[] = [
  // Жемістер
  { id: '1', name: 'Алма (1 кг)', description: 'Жаңа, табиғи алма. Витаминдерге бай.', price: 850, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', inStock: true },
  { id: '2', name: 'Банан (1 кг)', description: 'Пісіп жетілген банандар. Энергияға бай.', price: 1200, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', inStock: true },
  { id: '3', name: 'Апельсин (1 кг)', description: 'Шырынды апельсиндер. С витамині мол.', price: 1100, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop', inStock: true },
  { id: '4', name: 'Мандарин (1 кг)', description: 'Тәтті мандариндер. Балаларға ұнайды.', price: 1300, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=300&fit=crop', inStock: true },
  { id: '5', name: 'Жүзім (1 кг)', description: 'Қызыл жүзім. Тәтті және шырынды.', price: 1800, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop', inStock: true },
  { id: '6', name: 'Лимон (500 г)', description: 'Шырынды лимон. Шайға қосуға тамаша.', price: 600, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop', inStock: true },
  { id: '7', name: 'Алмұрт (1 кг)', description: 'Жұмсақ, хош иісті алмұрт.', price: 950, category: 'Жемістер', image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=400&h=300&fit=crop', inStock: true },

  // Көкөністер
  { id: '8', name: 'Қызанақ (1 кг)', description: 'Жаңа қызанақтар. Салатқа тамаша.', price: 900, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=300&fit=crop', inStock: true },
  { id: '9', name: 'Қияр (1 кг)', description: 'Сыртылдақ жаңа қиярлар.', price: 750, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=300&fit=crop', inStock: true },
  { id: '10', name: 'Картоп (1 кг)', description: 'Таза картоп. Барлық тағамға жарайды.', price: 350, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber40?w=400&h=300&fit=crop', inStock: true },
  { id: '11', name: 'Сәбіз (1 кг)', description: 'Жаңа сәбіз. Каротинге бай.', price: 400, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=300&fit=crop', inStock: true },
  { id: '12', name: 'Пияз (1 кг)', description: 'Қызыл пияз. Салатқа және тағамға.', price: 300, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop', inStock: true },
  { id: '13', name: 'Болгар бұрышы (1 кг)', description: 'Түрлі-түсті бұрыш. Витаминдерге бай.', price: 1200, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop', inStock: true },
  { id: '14', name: 'Қырыққабат (1 дана)', description: 'Жаңа қырыққабат. Борщқа тамаша.', price: 500, category: 'Көкөністер', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=300&fit=crop', inStock: true },

  // Сүт өнімдері
  { id: '15', name: 'Сүт (1 л)', description: 'Табиғи сиыр сүті. Кальцийге бай.', price: 650, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop', inStock: true },
  { id: '16', name: 'Кефир (1 л)', description: 'Пробиотиктерге бай. Асқазанға пайдалы.', price: 550, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1572443490709-e57345f45939?w=400&h=300&fit=crop', inStock: true },
  { id: '17', name: 'Йогурт (400 г)', description: 'Жемісті йогурт. Тәтті және пайдалы.', price: 450, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop', inStock: true },
  { id: '18', name: 'Ірімшік (300 г)', description: 'Қатты ірімшік. Сэндвичке тамаша.', price: 1200, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop', inStock: true },
  { id: '19', name: 'Сары май (200 г)', description: 'Табиғи сары май. Нанға жағуға.', price: 750, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop', inStock: true },
  { id: '20', name: 'Сметана (400 г)', description: 'Қою сметана. Борщқа тамаша.', price: 500, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400&h=300&fit=crop', inStock: true },
  { id: '21', name: 'Айран (1 л)', description: 'Салқын айран. Шөлді басады.', price: 400, category: 'Сүт өнімдері', image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155e0?w=400&h=300&fit=crop', inStock: true },

  // Ет өнімдері
  { id: '22', name: 'Тауық еті (1 кг)', description: 'Жаңа тауық еті. Диеталық.', price: 2200, category: 'Ет өнімдері', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', inStock: true },
  { id: '23', name: 'Сиыр еті (1 кг)', description: 'Жаңа сиыр еті. Сорпаға тамаша.', price: 3500, category: 'Ет өнімдері', image: 'https://images.unsplash.com/photo-1588347818481-073aa2ce2457?w=400&h=300&fit=crop', inStock: true },
  { id: '24', name: 'Қой еті (1 кг)', description: 'Қой еті. Бешбармаққа жарайды.', price: 3800, category: 'Ет өнімдері', image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=300&fit=crop', inStock: true },
  { id: '25', name: 'Шұжық (500 г)', description: 'Докторская шұжық. Сэндвичке.', price: 1100, category: 'Ет өнімдері', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop', inStock: true },
  { id: '26', name: 'Тартылған ет (500 г)', description: 'Тауық тартылған еті. Котлетке.', price: 1400, category: 'Ет өнімдері', image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=300&fit=crop', inStock: true },

  // Нан өнімдері
  { id: '27', name: 'Нан (бір бөлік)', description: 'Жаңа пісірілген нан. Жұмсақ.', price: 250, category: 'Нан өнімдері', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', inStock: true },
  { id: '28', name: 'Батон (1 дана)', description: 'Ақ батон. Бутербродқа тамаша.', price: 200, category: 'Нан өнімдері', image: 'https://images.unsplash.com/photo-1549931319-a545753467c8?w=400&h=300&fit=crop', inStock: true },
  { id: '29', name: 'Лаваш (3 дана)', description: 'Жұқа лаваш. Ораманға жарайды.', price: 350, category: 'Нан өнімдері', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop', inStock: true },
  { id: '30', name: 'Тоқаш (4 дана)', description: 'Тәтті тоқаштар. Шайға тамаша.', price: 400, category: 'Нан өнімдері', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=300&fit=crop', inStock: true },

  // Азық-түлік
  { id: '31', name: 'Күріш (1 кг)', description: 'Ұзын дәнді күріш. Пловқа тамаша.', price: 780, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop', inStock: true },
  { id: '32', name: 'Жұмыртқа (10 дана)', description: 'Тауық жұмыртқасы. Таңғы асқа.', price: 750, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', inStock: true },
  { id: '33', name: 'Ұн (2 кг)', description: 'Жоғары сортты ұн. Пісіруге.', price: 600, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop', inStock: true },
  { id: '34', name: 'Қант (1 кг)', description: 'Ақ қант. Шай ішуге.', price: 450, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop', inStock: true },
  { id: '35', name: 'Тұз (1 кг)', description: 'Ас тұзы. Тағамға қосуға.', price: 150, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&h=300&fit=crop', inStock: true },
  { id: '36', name: 'Өсімдік майы (1 л)', description: 'Күнбағыс майы. Қуыруға.', price: 850, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop', inStock: true },
  { id: '37', name: 'Макарон (500 г)', description: 'Спагетти макарон. Гарнирге.', price: 350, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=300&fit=crop', inStock: true },
  { id: '38', name: 'Гречка (1 кг)', description: 'Гречка жармасы. Пайдалы гарнир.', price: 650, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop', inStock: true },
  { id: '39', name: 'Сұлы жармасы (500 г)', description: 'Геркулес. Таңғы асқа тамаша.', price: 400, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop', inStock: true },
  { id: '40', name: 'Томат пастасы (500 г)', description: 'Қою томат пастасы. Тағамға.', price: 500, category: 'Азық-түлік', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop', inStock: true },

  // Сусындар
  { id: '41', name: 'Шай (100 пакет)', description: 'Қара шай. Күнделікті ішуге.', price: 950, category: 'Сусындар', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop', inStock: true },
  { id: '42', name: 'Кофе (200 г)', description: 'Ұнтақталған кофе. Хош иісті.', price: 1800, category: 'Сусындар', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop', inStock: true },
  { id: '43', name: 'Шырын (1 л)', description: 'Алма шырыны. Табиғи.', price: 700, category: 'Сусындар', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop', inStock: true },
  { id: '44', name: 'Минералды су (1.5 л)', description: 'Газсыз минералды су.', price: 250, category: 'Сусындар', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea55?w=400&h=300&fit=crop', inStock: true },

  // Тәттілер
  { id: '45', name: 'Шоколад (100 г)', description: 'Сүтті шоколад. Тәтті сүйгіштерге.', price: 550, category: 'Тәттілер', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop', inStock: true },
  { id: '46', name: 'Печенье (300 г)', description: 'Сарымай печеньесі. Шайға.', price: 450, category: 'Тәттілер', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop', inStock: true },
  { id: '47', name: 'Бал (500 г)', description: 'Табиғи бал. Шайға қосуға.', price: 2500, category: 'Тәттілер', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop', inStock: true },
  { id: '48', name: 'Тәтті сырок (5 дана)', description: 'Шоколадты сырок. Балаларға.', price: 600, category: 'Тәттілер', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', inStock: true },

  // Дайын тағамдар
  { id: '49', name: 'Сэндвич (1 дана)', description: 'Тауық етті сэндвич. Тез тамақтануға.', price: 800, category: 'Дайын тағамдар', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', inStock: true },
  { id: '50', name: 'Пицца (1 дана)', description: 'Мини пицца. Тауық етпен.', price: 1500, category: 'Дайын тағамдар', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', inStock: true },
  { id: '51', name: 'Самса (3 дана)', description: 'Етті самса. Жаңа пісірілген.', price: 900, category: 'Дайын тағамдар', image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=300&fit=crop', inStock: true },
  { id: '52', name: 'Манты (5 дана)', description: 'Етті манты. Үйдегідей дәмді.', price: 1200, category: 'Дайын тағамдар', image: 'https://images.unsplash.com/photo-1625938145744-533e82e78773?w=400&h=300&fit=crop', inStock: true },
];
export function getProducts(): Product[] {
  if (typeof window === 'undefined') return defaultProducts;
  const version = localStorage.getItem(PRODUCTS_VERSION_KEY);
  if (version !== CURRENT_VERSION) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    localStorage.setItem(PRODUCTS_VERSION_KEY, CURRENT_VERSION);
    return defaultProducts;
  }
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product, quantity = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter(item => item.product.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart();
  const item = cart.find(i => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function getCategories(): string[] {
  const products = getProducts();
  return [...new Set(products.map(p => p.category))];
}
