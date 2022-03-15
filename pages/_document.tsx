import {
  Html, Head, Main, NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="" />
        <link rel="apple-touch-icon" href="" />
        <meta name="apple-mobile-web-app-title" content="Wordchachos" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootswatch@5/dist/vapor/bootstrap.min.css"
          crossOrigin="anonymous"
        >
        </link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
