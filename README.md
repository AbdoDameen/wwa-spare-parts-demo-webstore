# WWA Spares - Appliance Spare Parts Platform

## Description
WWA Spares is a specialized e-commerce platform for appliance spare parts, featuring products from premium brands like Artusi, Everdure, Fhiaba, Fulgor, Omega Altise, Robinhood, and Steel. The platform provides an intuitive interface for customers to find and purchase genuine spare parts for their appliances.

## Core Features
- Brand-based navigation system
- Model-specific spare parts listings
- Real-time stock status indicators
- Interactive shopping cart
- Part number search functionality
- Technical diagram downloads
- Responsive design for all devices

## Website Structure
### Navigation
- Home page with brand selection
- Brand-specific model listings
- Detailed model pages with parts
- Support and warranty section
- Contact interface

### Product Organization
- Organized by brands > models > spare parts
- Each model page includes:
  - Product images
  - Technical specifications
  - Feature lists
  - Downloadable technical diagrams
  - Compatible spare parts table

### Parts Listing Features
- Part number references
- Stock availability status
- Real-time pricing
- Add to cart functionality
- Part compatibility information

## Technical Implementation
### Frontend Components
- Dynamic search functionality
  - Model search
  - Part number search
  - Real-time results display
  
- Shopping Cart System
  - Persistent cart storage
  - Real-time total calculation
  - Quantity management
  - Clear cart functionality

- User Interface
  - Breadcrumb navigation
  - Responsive grid layouts
  - Mobile-optimized menus
  - Interactive product cards

### JavaScript Features
- Cart management system
- Search functionality with debouncing
- Dynamic content loading
- Responsive animations
- Form validation

### Data Structure
- Products organized by:
  - Brand
  - Model
  - Part category
  - Availability status
  - Price points

## File Organization
```
wwa-spares/
├── index.html              # Main landing page
├── style.css              # Global styles
├── script.js             # Core functionality
├── js/
│   └── search.js         # Search implementation
├── brand_*/              # Brand-specific pages
├── model_*/              # Model detail pages
├── images/              # Product images
└── diagrams/            # Technical diagrams
```

## User Workflows
### Part Search Process
1. Enter model/part number in search bar
2. View real-time search results
3. Select relevant product
4. View detailed part information
5. Check availability
6. Add to cart if available

### Model Navigation
1. Select brand from homepage
2. Choose specific model
3. View model details and features
4. Access parts list
5. Download technical diagrams
6. Select required parts

### Support System
- Warranty claim submission
- Technical support requests
- Part compatibility checks
- Purchase assistance

## Cart Functionality
- Add/remove items
- Quantity adjustment
- Price calculation
- Persistent storage
- Checkout process

## Stock Management
- Real-time availability display
- Stock status indicators:
  - Available
  - Low Stock
  - Unavailable
- Automated button disabling for unavailable items

## Installation
```bash
1. Clone the repository
   git clone https://github.com/yourusername/wwa-spares.git

2. Configure your web server (Apache/Nginx)

3. Import the database
   mysql -u username -p database_name < database.sql

4. Configure database connection
   Edit includes/config.php with your database credentials

5. Install dependencies
   composer install
```

## Usage
### Customer Interface
- Browse products by category or search
- Add items to cart
- Create account/Login
- Checkout process
- Order tracking

### Admin Interface
- Inventory management
- Order processing
- Customer management
- Reports and analytics
- Product catalog maintenance

## API Documentation
The API endpoints are available at `/api/v1/`:
- GET /products - List all products
- GET /products/{id} - Get specific product
- POST /orders - Create new order
- GET /orders/{id} - Get order details

## Database Schema
Key tables:
- users
- products
- orders
- categories
- inventory

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing
```bash
# Run unit tests
php vendor/bin/phpunit

# Run integration tests
php vendor/bin/phpunit --testsuite integration.
```

## Performance Optimization
- Image optimization
- CDN integration
- Database indexing
- Caching implementation

## Security Measures
- Input validation
- Prepared statements for SQL
- Session management
- Password hashing
- Regular security audits

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Contact
For support or queries, please contact:
- Email: support@wwaspares.com
- Website: www.wwaspares.com

## Acknowledgments
- Bootstrap team
- PHP community
- All contributors

## Website Performance
- Optimized image loading
- Debounced search queries
- Efficient DOM manipulation
- Local storage utilization
- Responsive design principles

## Future Enhancements
- User accounts system
- Order history tracking
- Automated stock notifications
- Advanced filtering options
- Mobile application integration
