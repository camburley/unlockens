import React from 'react';
import '../styles/globals.css'
import { BreakpointProvider } from '../provider/breakpoint';

function MyApp({ Component, pageProps }) {

  const queries = {
    xs_mobile: '(max-width: 363px)',
    mobile: '(max-width: 440px)',
    tablet: '(max-width: 519px)',
    kindaWide: '(max-width: 1440px)',
    widescreen: '(max-width: 2180px)',
    orientation: '(orientation: portrait)' // we can check orientation also
  };

  return (
    <BreakpointProvider queries={queries}>
      <Component {...pageProps} />
  </BreakpointProvider>
  )
}

export default MyApp
