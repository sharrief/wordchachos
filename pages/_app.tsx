import type { AppProps } from 'next/app';
import '../styles/styles.css';
import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover, user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      {/* Self-hosted Rybbit analytics (analytics.fym.tech) */}
      <Script
        src="https://analytics.fym.tech/api/script.js"
        data-site-id="034a3562ea04"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
