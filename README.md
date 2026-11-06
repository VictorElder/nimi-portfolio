This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Private admin dashboard

The design gallery is managed at `/admin`. The dashboard uses Supabase Auth for persistent email/password sessions, Postgres for project details, and Supabase Storage for uploaded images. There is no public sign-up page: a person must be added by email before their account can access the dashboard.

### Connect Supabase

1. Create a Supabase project and copy `.env.example` to `.env.local` in the project root.
2. In `.env.local`, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` from the Supabase project’s API settings. Set `NEXT_PUBLIC_SITE_URL` to the app's origin (`http://localhost:3000` while developing). Keep `SUPABASE_SECRET_KEY` server-only; never give it a `NEXT_PUBLIC_` prefix.
3. Open the Supabase SQL Editor and run [`supabase/setup.sql`](supabase/setup.sql). This creates the protected admin roster, design table, public image bucket, and seeds the existing four designs.
4. In the SQL Editor, add the site owner’s email to the invite list. Replace the sample email with the exact email the owner will use to sign in:

   ```sql
   insert into public.admin_members (email, role)
   values ('owner@example.com', 'owner');
   ```

5. In Supabase **Authentication → URL Configuration**, set the Site URL to your local site during development (`http://localhost:3000`). Add `http://localhost:3000/auth/callback` to the allowed redirect URLs. When you deploy, set the Site URL to the production domain and add its callback URL too, such as `https://your-domain.com/auth/callback`.
6. In Supabase **Authentication → Users**, invite the same owner email. The app handles Supabase's default invitation link and exchanges its one-time session for a secure cookie. The owner opens the email invitation, sets a password, and can then sign in at `/admin/login`.
7. Restart the Next.js development server. The owner can now open `/admin` and invite the rest of the team by email.

The owner can invite other admins and managers. Admins can invite managers. Managers can add, edit, publish, unpublish, and delete portfolio designs. Invited teammates receive a one-time setup link to choose a password; their Supabase session is kept in secure cookies and refreshed while they use the site. Admins can change their password in Account settings or request a reset from the sign-in page.

Project uploads accept JPG, PNG, and WebP files up to 8 MB. Each design needs a project name, category, short project note, image, and display order. Unpublished designs remain in the dashboard but are hidden from the public Designs page.

### Access model

- `/admin` and all dashboard mutations verify the signed-in user against `admin_members` on the server.
- The owner’s email is entered manually in the protected roster during the one-time setup. Only invited addresses can enter the dashboard.
- The service secret is used only by server code for invitations, roster access, image storage, and project writes. Public visitors can read published designs; they cannot write to the project table or upload files.
- To remove a teammate’s access, delete their email from `public.admin_members` in Supabase. Their account may still exist in Auth, but it will no longer pass the dashboard’s access check.

If the Supabase environment variables are not present, the public site continues to use its original local project list and the admin route displays setup guidance.

New Free-tier Supabase projects may restrict the default email service to Supabase organization team addresses. If invitations to outside managers are rejected, configure custom SMTP for Auth before inviting them.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
