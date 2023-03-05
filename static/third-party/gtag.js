window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

let c = document.getElementById("gtag-arguments");
let id = ""
if (c) {
  let c_id = c.getAttribute("gtag-id")
  if (c_id) {
    id = c_id
  }
}

gtag('config', id);