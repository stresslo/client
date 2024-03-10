const snap = () => {
        const midtransScriptUrl = 'https://app.midtrans.com/snap/snap.js';  
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        scriptTag.setAttribute('data-client-key', import.meta.env.VITE_CLIENT_KEY);
        document.body.appendChild(scriptTag);
        return () => {
          document.body.removeChild(scriptTag);
        }

}

export default snap