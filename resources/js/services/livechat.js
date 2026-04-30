// services/TawkService.js
const TAWK_PROPERTY_ID = "69f33995eb115a1c32245bd1";
const TAWK_WIDGET_ID = "1jnf1hscv";

const TawkService = {
    _scriptEl: null,
    _initialized: false,
    _readyPromise: null,

    init() {
        if (typeof window === "undefined" || this._initialized) return;

        this._initialized = true;
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        this._scriptEl = document.createElement("script");
        this._scriptEl.async = true;
        this._scriptEl.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
        this._scriptEl.charset = "UTF-8";
        this._scriptEl.setAttribute("crossorigin", "*");

        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode.insertBefore(this._scriptEl, firstScript);    
      
    },   
};

export default TawkService;

