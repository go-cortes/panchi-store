// Script para hacer funcionales todos los elementos del footer
document.addEventListener('DOMContentLoaded', function() {
    // Hacer funcionales los enlaces de redes sociales
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        if (!link.href || link.href === '#') {
            const icon = link.querySelector('i');
            if (icon) {
                const iconClass = icon.className;
                if (iconClass.includes('facebook')) {
                    link.href = 'https://facebook.com/panchistore';
                    link.title = 'Síguenos en Facebook';
                    link.addEventListener('mouseover', () => link.style.color = '#1877F2');
                    link.addEventListener('mouseout', () => link.style.color = '');
                } else if (iconClass.includes('twitter')) {
                    link.href = 'https://twitter.com/panchistore';
                    link.title = 'Síguenos en Twitter';
                    link.addEventListener('mouseover', () => link.style.color = '#1DA1F2');
                    link.addEventListener('mouseout', () => link.style.color = '');
                } else if (iconClass.includes('instagram')) {
                    link.href = 'https://instagram.com/panchistore';
                    link.title = 'Síguenos en Instagram';
                    link.addEventListener('mouseover', () => link.style.color = '#E4405F');
                    link.addEventListener('mouseout', () => link.style.color = '');
                } else if (iconClass.includes('linkedin')) {
                    link.href = 'https://linkedin.com/company/panchistore';
                    link.title = 'Conecta con nosotros en LinkedIn';
                    link.addEventListener('mouseover', () => link.style.color = '#0077B5');
                    link.addEventListener('mouseout', () => link.style.color = '');
                } else if (iconClass.includes('youtube')) {
                    link.href = 'https://youtube.com/@panchistore';
                    link.title = 'Suscríbete a nuestro canal';
                    link.addEventListener('mouseover', () => link.style.color = '#FF0000');
                    link.addEventListener('mouseout', () => link.style.color = '');
                }
                link.target = '_blank';
            }
        }
    });

    // Hacer funcionales los enlaces de categorías
    const categoryLinks = document.querySelectorAll('a[href*="categoria"]');
    categoryLinks.forEach(link => {
        link.addEventListener('mouseover', () => link.style.color = '#8B4513');
        link.addEventListener('mouseout', () => link.style.color = '');
    });

    // Hacer funcionales los enlaces de contacto
    const contactLinks = document.querySelectorAll('.contact-info a, .contact-info li');
    contactLinks.forEach(element => {
        if (element.tagName === 'LI') {
            const text = element.textContent.trim();
            if (text.includes('Av. Principal')) {
                const link = document.createElement('a');
                link.href = 'https://maps.google.com/?q=Av+Principal+123+Santiago';
                link.target = '_blank';
                link.className = 'text-muted text-decoration-none';
                link.innerHTML = element.innerHTML;
                link.addEventListener('mouseover', () => link.style.color = '#8B4513');
                link.addEventListener('mouseout', () => link.style.color = '');
                element.innerHTML = '';
                element.appendChild(link);
            } else if (text.includes('+56 9 1234 5678')) {
                const link = document.createElement('a');
                link.href = 'tel:+56912345678';
                link.className = 'text-muted text-decoration-none';
                link.innerHTML = element.innerHTML;
                link.addEventListener('mouseover', () => link.style.color = '#8B4513');
                link.addEventListener('mouseout', () => link.style.color = '');
                element.innerHTML = '';
                element.appendChild(link);
            } else if (text.includes('contacto@')) {
                const link = document.createElement('a');
                link.href = 'mailto:contacto@panchistore.cl';
                link.className = 'text-muted text-decoration-none';
                link.innerHTML = element.innerHTML;
                link.addEventListener('mouseover', () => link.style.color = '#8B4513');
                link.addEventListener('mouseout', () => link.style.color = '');
                element.innerHTML = '';
                element.appendChild(link);
            }
        }
    });

    // Hacer funcionales los enlaces de navegación
    const navLinks = document.querySelectorAll('footer a[href="../index.html"], footer a[href="index.html"]');
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => link.style.color = '#8B4513');
        link.addEventListener('mouseout', () => link.style.color = '');
    });

    // Agregar funcionalidad a los enlaces de login
    const loginLinks = document.querySelectorAll('a[href*="login"]');
    loginLinks.forEach(link => {
        link.addEventListener('mouseover', () => link.style.color = '#8B4513');
        link.addEventListener('mouseout', () => link.style.color = '');
    });
});
