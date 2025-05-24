# Create a new Next.js project
npx create-next-app@latest hospital-management --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Navigate to the project
cd hospital-management

# Install additional dependencies
npm install lucide-react @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-dropdown-menu

# Install shadcn/ui
npx shadcn@latest init

# Add required shadcn components
npx shadcn@latest add button card input label select tabs dropdown-menu badge table
