import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Cluck Me</title>
        <meta name="description" content="💦" />
        <link rel="icon" href="/favicon.ico" />
        {/* icon from https://icons8.com/icon/fpZlxwEzKKxH/chicken */}
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
    );
}

export default api.withTRPC(MyApp);
