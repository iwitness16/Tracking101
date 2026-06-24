import Script from 'next/script'

const SMARTSUPP_KEY = 'fc863b6c8acd6135c37ca541f9831bb85a321ca6'

export function SmartsuppChat() {
  return (
    <>
      <Script id="smartsupp-live-chat" strategy="afterInteractive">
        {`
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = '${SMARTSUPP_KEY}';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `}
      </Script>
      <noscript>
        Powered by{' '}
        <a
          href="https://www.smartsupp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Smartsupp
        </a>
      </noscript>
    </>
  )
}
