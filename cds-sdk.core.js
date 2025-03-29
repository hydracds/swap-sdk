// sdk-core.js
class CardexscanSDK {
    constructor(options = {}) {
      this.options = {
        componentName: 'cardexscan-swap',
        scriptUrl: 'http://127.0.0.1:8080/widget.js',
        styleUrl: 'http://127.0.0.1:8080/styles.css',
        version: 'latest',
        ...options
      };
      this.loaded = false;
    }
  
    async load() {
      if (this.loaded) return true;
      
      try {
        await this._injectStyles();
        await this._injectScript();
        await this._waitForComponent();
        this.loaded = true;
        return true;
      } catch (error) {
        console.error('SDK loading failed:', error);
        return false;
      }
    }

    _injectStyles() {
        return new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.href = this._getStyleUrl();
          link.rel = 'stylesheet';
          link.as = 'style';
          link.onload = resolve;
          link.onerror = reject;
          document.head.appendChild(link);
        });
      }
  
    _injectScript() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = this._getScriptUrl();
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  
    _waitForComponent() {
      return new Promise((resolve, reject) => {
        const checkInterval = 100; // ms
        const timeout = 10000; // 10 seconds
        const startTime = Date.now();
        
        const check = () => {
          if (customElements.get(this.options.componentName)) {
            resolve();
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Component ${this.options.componentName} not registered`));
          } else {
            setTimeout(check, checkInterval);
          }
        };
        
        check();
      });
    }
  
    _getScriptUrl() {
      return `${this.options.scriptUrl}?v=${this.options.version}`;
    }

    _getStyleUrl() {
      return `${this.options.styleUrl}?v=${this.options.version}`;
    }
  }
  
  // Export for different environments
  if (typeof window !== 'undefined') {
    window.CardexscanSDK = CardexscanSDK;
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardexscanSDK;
  }