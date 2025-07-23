import StorageInitializer from './StorageInitializer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/logo_ofc.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
        <title>RB Recursos Humanos</title>
    </head>
      <body>   
        <StorageInitializer>
          {children}
        </StorageInitializer>
      </body>
    </html>
  );
}