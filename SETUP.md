# Setup Instructions

## Quick Start

1. **Clone the repository:**
\`\`\`bash
git clone https://github.com/yourusername/hospital-management-system.git
cd hospital-management-system
\`\`\`

2. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

3. **Initialize shadcn/ui:**
\`\`\`bash
npx shadcn@latest init
\`\`\`

4. **Add required components:**
\`\`\`bash
npx shadcn@latest add button card input label select tabs dropdown-menu badge table
\`\`\`

5. **Run the development server:**
\`\`\`bash
npm run dev
\`\`\`

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## File Structure

After setup, your project should look like this:

\`\`\`
hospital-management-system/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       ├── patient/
│       ├── doctor/
│       ├── admin/
│       └── staff/
├── components/
│   └── ui/
├── lib/
│   └── utils.ts
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
\`\`\`

## Adding the Main Application Files

Copy the React components from the main code project into the corresponding files:

1. Copy `app/page.tsx` (Login page)
2. Copy all dashboard pages into their respective folders
3. Add the image assets to the `public/` folder

## Environment Variables

Create a `.env.local` file for environment variables:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
DATABASE_URL=postgresql://username:password@localhost:5432/hospital_db
\`\`\`

## Database Integration

To connect with your PostgreSQL database:

1. Install database dependencies:
\`\`\`bash
npm install @prisma/client prisma
\`\`\`

2. Set up Prisma (optional):
\`\`\`bash
npx prisma init
\`\`\`

3. Configure your database schema based on your ER diagram

## Deployment

### Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Docker
\`\`\`bash
docker build -t hospital-management .
docker run -p 3000:3000 hospital-management
\`\`\`

## Troubleshooting

### Common Issues:

1. **shadcn/ui components not found:**
   - Run `npx shadcn@latest add [component-name]`

2. **TypeScript errors:**
   - Run `npm run type-check`

3. **Styling issues:**
   - Ensure Tailwind CSS is properly configured
   - Check `globals.css` imports

4. **Image loading issues:**
   - Verify images are in the `public/` folder
   - Check `next.config.js` image configuration

## Development Workflow

1. Create feature branches: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit changes: `git commit -m "Add new feature"`
4. Push and create pull request

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
