import React, { useEffect } from 'react';

const TwakChat: React.FC = () => {
  useEffect(() => {
    // var Tawk_API = Tawk_API || {};
    // var Tawk_LoadStart = new Date();
    // (function () {
    //   var s1 = document.createElement("script");
    //   s1.async = true;
    //   // Ensure you replace YOUR_ACTUAL_WIDGET_ID with your real ID if you re-enable this
    //   s1.src = "https://embed.tawk.to/YOUR_ACTUAL_WIDGET_ID/default"; 
    //   s1.charset = "UTF-8";
    //   s1.setAttribute("crossorigin", "*");
    //   // Ensure document.body exists if this script runs very early
    //   if (document.body) {
    //     document.body.appendChild(s1);
    //   } else {
    //     // Fallback if body is not yet available, though with React this is less common
    //     window.addEventListener('load', () => document.body.appendChild(s1));
    //   }
    // })();
    console.log("Tawk.to chat integration is currently disabled.");
  }, []);

  return null; // Render nothing
};

export default TwakChat;