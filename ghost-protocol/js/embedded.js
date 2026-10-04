if (document.documentElement.classList.contains('embedded')) {
  const send=data=>parent.postMessage({scope:'ghost-module',...data},location.origin);
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;const match=url.pathname.match(/\/pages\/([a-z]+)\.html$/);if(match){e.preventDefault();send({type:'open',id:match[1]})}else if(/\/index\.html$/.test(url.pathname)){e.preventDefault();send({type:'overview'})}},true);
  addEventListener('DOMContentLoaded',()=>{const report=()=>send({type:'height',height:document.documentElement.scrollHeight});new ResizeObserver(report).observe(document.querySelector('main')||document.body);report()});
}
