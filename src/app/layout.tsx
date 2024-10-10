import "../styles/globals.css";
import { Londrina_Solid } from "next/font/google";

const londrinaSolid = Londrina_Solid({ subsets: ["latin"], weight: ["400"] });
export const metadata = {
  title: "Lustige Gurkenkuh",
  description: "A funny animal generator game for children",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={londrinaSolid.className}>{children}</body>
    </html>
  );
}
