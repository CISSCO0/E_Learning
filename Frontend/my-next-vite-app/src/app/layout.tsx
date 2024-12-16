import React from 'react';

export const metadata = {
  title: 'My App',
  description: 'A sample Next.js app with a header and sidebar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add any additional metadata here */}
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
