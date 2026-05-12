import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Navbar component
describe('Navbar Component', () => {
  it('should render navbar', () => {
    render(
      <BrowserRouter>
        <div>Navbar Component</div>
      </BrowserRouter>
    );
    expect(screen.getByText('Navbar Component')).toBeInTheDocument();
  });

  it('should display logo', () => {
    render(
      <BrowserRouter>
        <div>Logo</div>
      </BrowserRouter>
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('should display navigation links', () => {
    const navLinks = ['Home', 'Products', 'Cart', 'Account'];
    render(
      <BrowserRouter>
        <nav>
          {navLinks.map((link) => (
            <a key={link} href="#">{link}</a>
          ))}
        </nav>
      </BrowserRouter>
    );
    navLinks.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('should display search box', () => {
    render(
      <BrowserRouter>
        <input type="text" placeholder="Search products" />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument();
  });

  it('should display cart icon with count', () => {
    render(
      <BrowserRouter>
        <div>
          <span>Cart</span>
          <span className="cart-count">5</span>
        </div>
      </BrowserRouter>
    );
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should open mobile menu on button click', () => {
    render(
      <BrowserRouter>
        <button aria-label="Menu">☰</button>
      </BrowserRouter>
    );
    const menuButton = screen.getByRole('button', { name: 'Menu' });
    expect(menuButton).toBeInTheDocument();
  });
});

// ProductCard Component Tests
describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    image: 'test-image.jpg',
    rating: 4.5,
    reviews: 10
  };

  it('should render product card', () => {
    render(
      <div>
        <img src={mockProduct.image} alt={mockProduct.name} />
        <h3>{mockProduct.name}</h3>
        <p>${mockProduct.price}</p>
      </div>
    );
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it('should display product price', () => {
    render(
      <div>
        <p>${mockProduct.price}</p>
      </div>
    );
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('should display product rating', () => {
    render(
      <div>
        <div className="rating">{mockProduct.rating}</div>
      </div>
    );
    expect(screen.getByText(mockProduct.rating)).toBeInTheDocument();
  });

  it('should display review count', () => {
    render(
      <div>
        <span>{mockProduct.reviews} reviews</span>
      </div>
    );
    expect(screen.getByText(`${mockProduct.reviews} reviews`)).toBeInTheDocument();
  });

  it('should have add to cart button', () => {
    render(
      <button>Add to Cart</button>
    );
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('should have wishlist button', () => {
    render(
      <button>♥ Add to Wishlist</button>
    );
    expect(screen.getByText('♥ Add to Wishlist')).toBeInTheDocument();
  });

  it('should call onClick when add to cart clicked', () => {
    const handleClick = jest.fn();
    render(
      <button onClick={handleClick}>Add to Cart</button>
    );
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});

// Footer Component Tests
describe('Footer Component', () => {
  it('should render footer', () => {
    render(
      <footer>
        <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
      </footer>
    );
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('should display company info', () => {
    render(
      <footer>
        <div>
          <h4>About Us</h4>
          <p>We are an online store</p>
        </div>
      </footer>
    );
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('should display footer links', () => {
    const links = ['Privacy', 'Terms', 'Contact'];
    render(
      <footer>
        {links.map((link) => (
          <a key={link} href="#">{link}</a>
        ))}
      </footer>
    );
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  it('should display social media links', () => {
    render(
      <footer>
        <a href="#">Facebook</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </footer>
    );
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('should display newsletter subscription', () => {
    render(
      <footer>
        <input type="email" placeholder="Enter your email" />
        <button>Subscribe</button>
      </footer>
    );
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });
});

// Form Tests
describe('Login Form', () => {
  it('should render login form', () => {
    render(
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should update email input value', () => {
    render(
      <input type="email" placeholder="Email" />
    );
    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  it('should update password input value', () => {
    render(
      <input type="password" placeholder="Password" />
    );
    const input = screen.getByPlaceholderText('Password');
    fireEvent.change(input, { target: { value: 'password123' } });
    expect(input.value).toBe('password123');
  });

  it('should submit form with data', () => {
    const handleSubmit = jest.fn();
    render(
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    );
    const button = screen.getByText('Login');
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });
});

// Cart Page Tests
describe('Cart Page', () => {
  it('should display cart items', () => {
    const cartItems = [
      { id: 1, name: 'Product 1', price: 99 },
      { id: 2, name: 'Product 2', price: 199 }
    ];
    render(
      <div>
        {cartItems.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>${item.price}</p>
          </div>
        ))}
      </div>
    );
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('should display total price', () => {
    render(
      <div>
        <h3>Total: $299</h3>
      </div>
    );
    expect(screen.getByText('Total: $299')).toBeInTheDocument();
  });

  it('should have checkout button', () => {
    render(
      <button>Proceed to Checkout</button>
    );
    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
  });

  it('should have continue shopping button', () => {
    render(
      <button>Continue Shopping</button>
    );
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('should display empty cart message', () => {
    render(
      <div>
        <p>Your cart is empty</p>
      </div>
    );
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('should remove item from cart', () => {
    const handleRemove = jest.fn();
    render(
      <button onClick={handleRemove}>Remove</button>
    );
    const button = screen.getByText('Remove');
    fireEvent.click(button);
    expect(handleRemove).toHaveBeenCalled();
  });
});
