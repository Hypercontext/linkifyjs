---
---
logoSvg = document.getElementById('linkify-home-logo').firstElementChild
for path, i in logoSvg.children
    path.classList.add('linkify-logo-stroke')
