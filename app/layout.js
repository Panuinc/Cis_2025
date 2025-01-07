import { Prompt, Sulphur_Point } from "next/font/google";
import "@/public/css/globals.css";
// import Provider from "@/components/NextUIProvider";
// import { CustomProviders } from "@/components/provider";

const prompt = Prompt({
  subsets: ["latin"],
  variable: "--prompt",
  weight: "300",
  display: "swap",
});

const sulphur_Point = Sulphur_Point({
  subsets: ["latin"],
  variable: "--sulphur_Point",
  weight: "400",
  display: "swap",
});
export const metadata = {
  title: "Cis Internal System",
  description: "Development for the Next Generations",
};

export default function RootLayout({ children }) {
  return (
    // <CustomProviders>
    <html lang="en">
      <head>
        <link rel="icon" href="/images/company_logo/company_logo.png" />
      </head>
      <body
        className={`${sulphur_Point.variable} ${prompt.variable} antialiased`}
      >
        {/* <Provider> */}
        <div className="flex items-center justify-center w-full h-screen p-2 gap-2 border-2 border-dark border-dashed bg-default text-dark">
          {children}
        </div>
        {/* </Provider> */}
      </body>
    </html>
    // </CustomProviders>
  );
}
