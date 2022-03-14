import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
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
  )
}