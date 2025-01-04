import { Prompt, Roboto_Flex } from "next/font/google";
import "@/public/css/globals.css";
// import Provider from "@/components/NextUIProvider";
// import { CustomProviders } from "@/components/provider";

const prompt = Prompt({
  subsets: ["latin"],
  variable: "--prompt",
  weight: "300",
  display: "swap",
});

const roboto_Flex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--roboto_Flex",
  weight: "300",
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
        className={`${roboto_Flex.variable} ${prompt.variable} antialiased`}
      >
        {/* <Provider> */}
        <div className="flex items-center justify-center w-full h-screen  bg-default text-dark">
          {children}
        </div>
        {/* </Provider> */}
      </body>
    </html>
    // </CustomProviders>
  );
}
