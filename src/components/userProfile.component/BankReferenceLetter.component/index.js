import React, { useEffect } from 'react';
import { Row } from 'antd';
const BankDeclarationForm = () => {
  useEffect(() => {
    const script1 = document?.createElement('script');
    script1.src = 'https://form.jotform.com/static/feedback2.js';
    script1.type = 'text/javascript';
    document?.body?.appendChild(script1);
  }, []);

  const handleButtonClick = () => {
    const script2 = document?.createElement('script');
    script2.innerHTML = `
      var JFL_231763449585064 = new JotformFeedback({
        formId: '231763449585064',
        base: 'https://form.jotform.com/',
        windowTitle: 'Bank Reference Letter',
        backgroundColor: '#FFA500',
        fontColor: '#FFFFFF',
        type: 'false',
        height: 500,
        width: 700,
        openOnLoad: false
      });

      var ifr = document.getElementById("lightbox-231763449585064");
      if (ifr) {
        var src = ifr.src;
        var iframeParams = [];
        if (window.location.href && window.location.href.indexOf("?") > -1) {
          iframeParams = iframeParams.concat(window.location.href.substr(window.location.href.indexOf("?") + 1).split('&'));
        }
        if (src && src.indexOf("?") > -1) {
          iframeParams = iframeParams.concat(src.substr(src.indexOf("?") + 1).split("&"));
          src = src.substr(0, src.indexOf("?"))
        }
        iframeParams.push("isIframeEmbed=1");
        ifr.src = src + "?" + iframeParams.join('&');
      }

      window.handleIFrameMessage = function(e) {
        if (typeof e.data === 'object') { return; }
        var args = e.data.split(":");
        if (args.length > 2) { iframe = document.getElementById("lightbox-" + args[(args.length - 1)]); } else { iframe = document.getElementById("lightbox"); }
        if (!iframe) { return; }
        switch (args[0]) {
          case "scrollIntoView":
            iframe.scrollIntoView();
            break;
          case "setHeight":
            iframe.style.height = args[1] + "px";
            if (!isNaN(args[1]) && parseInt(iframe.style.minHeight) > parseInt(args[1])) {
              iframe.style.minHeight = args[1] + "px";
            }
            break;
          case "collapseErrorPage":
            if (iframe.clientHeight > window.innerHeight) {
              iframe.style.height = window.innerHeight + "px";
            }
            break;
          case "reloadPage":
            window.location.reload();
            break;
          case "loadScript":
            if (!window.isPermitted(e.origin, ['jotform.com', 'jotform.pro'])) { break; }
            var src = args[1];
            if (args.length > 3) {
              src = args[1] + ':' + args[2];
            }
            var script = document.createElement('script');
            script.src = src;
            script.type = 'text/javascript';
            document.body.appendChild(script);
            break;
          case "exitFullscreen":
            if (window.document.exitFullscreen) window.document.exitFullscreen();
            else if (window.document.mozCancelFullScreen) window.document.mozCancelFullScreen();
            else if (window.document.mozCancelFullscreen) window.document.mozCancelFullScreen();
            else if (window.document.webkitExitFullscreen) window.document.webkitExitFullscreen();
            else if (window.document.msExitFullscreen) window.document.msExitFullscreen();
            break;
        }
        var isJotForm = e.origin.indexOf("jotform") > -1 ? true : false;
        if (isJotForm && "contentWindow" in iframe && "postMessage" in iframe.contentWindow) {
          var urls = {
            "docurl": encodeURIComponent(document.URL),
            "referrer": encodeURIComponent(document.referrer)
          };
          iframe.contentWindow.postMessage(JSON.stringify({
            "type": "urls",
            "value": urls
          }), "*");
        }
      };

      window.isPermitted = function(originUrl, whitelisted_domains) {
        var url = document.createElement('a');
        url.href = originUrl;
        var hostname = url.hostname;
        var result = false;
        if (typeof hostname !== 'undefined') {
          whitelisted_domains.forEach(function(element) {
            if (hostname.slice(-1 * element.length - 1) === '.'.concat(element) || hostname === element) {
              result = true;
            }
          });
          return result;
        }
      };

      if (window.addEventListener) {
        window.addEventListener("message", handleIFrameMessage, false);
      } else if (window.attachEvent) {
        window.attachEvent("onmessage", handleIFrameMessage);
      }
    `;
    document?.body?.appendChild(script2);
  };

  return (
    <div>
                <div className="basicprofile-info">
                      <Row className="order-bottom add-custom">
                     <a
        className="btn lightbox-231763449585064"
        style={{
          marginTop: '16px',
          textTransform: 'uppercase',
          fontSize: '14px',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'inline-block',
          padding: '10px',
          fontFamily: 'inherit',
          textShadow: 'none',
          userSelect: 'none',
          transition: 'all .1s ease-in',
          backgroundColor: '#FFA500',
          border: '1px solid #FFA500',
          color: '#FFFFFF',
        }}
        onClick={handleButtonClick}
      >
        Bank Reference Letter
      </a>
      </Row></div>
    </div>
  );
};

export default BankDeclarationForm;
