import "./globals.css";

export const metadata = {
  title: "Viralivo AI",
  description: "Create viral faceless videos with AI."
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
