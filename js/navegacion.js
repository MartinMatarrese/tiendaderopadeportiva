cabeza.appendChild(navegar);
navegar.appendChild(nav);
nav.appendChild(ul);
navegar.className = 'navbar';

for(const link of links) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${link.toLocaleLowerCase()}.html" >${link}</a>`
    ul.appendChild(li);
};
if(ul.children.length > 0) {
    ul.children[0].querySelector('a').innerText = "INICIO";
}
footer[0].appendChild(parrafoFooter);
parrafoFooter.innerHTML = `<h3>${fecha}</h3>`;
footer[0].appendChild(div);
document.addEventListener('DOMContentLoaded', () => {
    const redes = document.getElementById('redes')
    redes.innerHTML = `
                   <h4>Nuestas redes:</h4>
                   <a href="https://www.facebook.com/?locale=es_LA" target= "_blank"><img src= "image/facebook.png" alt= "Facebook"></a>
                   <a href="https://www.instagram.com/" target= "_blank"><img src= "image/instagram.png" alt= "Instagram"></a>
    `;
});