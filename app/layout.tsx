import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "OPENVERSE — Build what matters, together",
  description: "An open innovation ecosystem where everyone can share ideas, collaborate, and build useful things together."
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
