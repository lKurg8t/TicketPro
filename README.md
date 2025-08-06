
### Admin Features
* Dashboard with system statistics
* Customer management (view, edit, delete)
* Ticket management with status updates
* Account deletion request approvals
* Real-time notifications for pending requests

## Technology Stack

* Frontend: React 18 with TypeScript
* Routing: React Router DOM
* Styling: Tailwind CSS with custom design system
* HTTP Client: Axios
* State Management: React Context API
* UI Components: Radix UI (shadcn/ui)
* Icons: Lucide React
* Data Source: MockAPI.io

## MockAPI.io Configuration

This project uses MockAPI.io as the backend service. You need to create your own MockAPI project with the following resources:

### Base URL Structure
```
https://[your-project-id].mockapi.io/
```

### Resource 1: Customers
Endpoint: `/Customers`

Fields:
* id (string, auto-generated)
* firstName (string, required)
* lastName (string, required)
* email (string, required)
* phone (string, required)
* createdAt (date, auto-generated)

### Resource 2: Tickets
Endpoint: `/Tickets`

Fields:
* id (string, auto-generated)
* customerId (string, foreign key to Customers)
* title (string, required)
* description (string, required)
* status (string, enum: "Open", "In Progress", "Closed")
* createdAt (date, auto-generated)

### Setting up MockAPI.io

1. Go to mockapi.io and create a new project
2. Create a resource named "Customers" with the fields listed above
3. Create a resource named "Tickets" with the fields listed above
4. Copy your project URL (format: https://[project-id].mockapi.io/)
5. Update the API_BASE constant in `src/services/api.ts` with your URL

### Available API Endpoints

**Customers:**
* GET /Customers (Get all customers)
* GET /Customers/:id (Get customer by ID)
* POST /Customers (Create new customer)
* PUT /Customers/:id (Update customer)
* DELETE /Customers/:id (Delete customer)

**Tickets:**
* GET /Tickets (Get all tickets)
* GET /Tickets/:id (Get ticket by ID)
* GET /Tickets?customerId={id} (Get tickets by customer ID)
* POST /Tickets (Create new ticket)
* PUT /Tickets/:id (Update ticket)
* DELETE /Tickets/:id (Delete ticket)

## Installation and Setup

### Prerequisites
* Node.js (version 16 or higher)
* npm or yarn package manager
* A MockAPI.io account and project

### Step 1: Clone the Repository
```bash
git clone https://github.com/lKurg8t/TicketPro
cd TicketPro
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure API Connection
1. Open `src/services/api.ts`
2. Replace the API_BASE URL with your MockAPI.io project URL:
```typescript
const API_BASE = 'https://your-project-id.mockapi.io';
```

### Step 4: Start Development Server
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Step 5: Create Test Data
Since MockAPI.io starts with empty resources, you'll need to create initial data:

1. Register a new user through the application
2. The first user created should ideally have ID "1" to be the admin
3. Create additional test customers and tickets as needed

## User Roles and Permissions

### Admin User (ID = "1")
* Full access to customer management
* Can view and manage all tickets
* Receives notifications for account deletion requests
* Can approve or decline account deletion requests
* Access to admin dashboard with system statistics

### Regular Users
* Can view and edit their own profile
* Can create and manage their own tickets
* Can request account deletion
* Limited to their own data only

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
├── services/          # API service layer
└── types/             # TypeScript type definitions
```

## Build and Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Environment Variables

For production deployment, you may want to use environment variables:

Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=https://your-project-id.mockapi.io
```

Then update `src/services/api.ts` to use:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://your-project-id.mockapi.io';
```

## Development Notes

### Authentication Flow
The authentication system simulates a real login by validating email existence in the customers database. In production, you would implement proper password hashing and JWT tokens.

### Admin Detection
Admin privileges are granted based on user ID being "1". This is a simplified approach for demonstration purposes.

### Data Persistence
All data is stored in MockAPI.io. The service provides REST endpoints that simulate a real database with automatic ID generation and timestamps.

## Customization

### Styling
The project uses a custom design system with CSS variables defined in `src/index.css`. The color scheme uses a dark theme with purple accents.

### Adding New Features
1. Define new types in the appropriate service file
2. Add API methods in `src/services/api.ts`
3. Create new components in focused, single-purpose files
4. Update routing in `src/App.tsx` if needed

### Theme Customization
Modify the CSS custom properties in `src/index.css` to change the color scheme and styling variables.

## Troubleshooting

### Common Issues

**API Connection Errors:**
* Verify your MockAPI.io URL is correct
* Check that your MockAPI project has the required resources
* Ensure CORS is properly configured (MockAPI.io handles this automatically)

**Authentication Issues:**
* Make sure you have created at least one customer record
* Verify the email format matches exactly
* Check browser console for detailed error messages

**Build Errors:**
* Ensure all TypeScript types are properly defined
* Check that all imports reference existing files
* Verify all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
