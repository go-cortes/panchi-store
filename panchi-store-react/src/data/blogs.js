// Contenido del blog (migrado desde js/blog.js)
const blogPosts = [
  {
    id: 1,
    titulo: "Cuidados Básicos para Perros en Invierno",
    resumen:
      "Consejos esenciales para mantener a tu perro saludable durante los meses más fríos del año.",
    contenido: `
            <h3>Protección contra el frío</h3>
            <p>Durante el invierno, es importante proteger a tu perro del frío extremo. Si tu perro tiene pelo corto o es de raza pequeña, considera usar ropa abrigada para mascotas cuando salgan a pasear.</p>
            
            <h3>Alimentación adecuada</h3>
            <p>En invierno, los perros pueden necesitar más calorías para mantener su temperatura corporal. Consulta con tu veterinario sobre ajustar la cantidad de comida si es necesario.</p>
            
            <h3>Ejercicio en interiores</h3>
            <p>Cuando hace demasiado frío para salir, asegúrate de que tu perro haga ejercicio en casa. Los juguetes interactivos y los juegos de búsqueda son excelentes opciones.</p>
            
            <h3>Hidratación</h3>
            <p>Aunque haga frío, tu perro sigue necesitando agua fresca. Asegúrate de que siempre tenga acceso a agua limpia y a temperatura ambiente.</p>
        `,
    imagen:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=center",
    fecha: "2024-01-15",
    categoria: "Salud",
    autor: "Dr. María González",
  },
  {
    id: 2,
    titulo: "Alimentación Natural para Gatos: Guía Completa",
    resumen:
      "Descubre cómo preparar una dieta natural y balanceada para tu gato en casa.",
    contenido: `
            <h3>Beneficios de la alimentación natural</h3>
            <p>La alimentación natural para gatos puede ofrecer varios beneficios, incluyendo mejor digestión, pelaje más brillante y mayor energía.</p>
            
            <h3>Ingredientes esenciales</h3>
            <p>Una dieta natural para gatos debe incluir proteínas de alta calidad (carne, pescado), grasas saludables, y una pequeña cantidad de carbohidratos.</p>
            
            <h3>Recetas básicas</h3>
            <p>Pollo hervido con arroz integral, salmón con calabaza, o pavo con zanahorias son excelentes opciones para comenzar.</p>
            
            <h3>Precauciones importantes</h3>
            <p>Siempre consulta con tu veterinario antes de cambiar la dieta de tu gato. Algunos alimentos humanos pueden ser tóxicos para los felinos.</p>
        `,
    imagen:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop&crop=center",
    fecha: "2024-01-10",
    categoria: "Alimentación",
    autor: "Nutricionista Veterinaria Ana Martínez",
  },
  {
    id: 3,
    titulo: "Juguetes DIY para Mascotas: Divertidos y Económicos",
    resumen:
      "Crea juguetes caseros seguros y divertidos para tu mascota sin gastar mucho dinero.",
    contenido: `
            <h3>Juguetes para perros</h3>
            <p>Una botella de plástico limpia con algunos agujeros y golosinas en el interior puede mantener a tu perro entretenido por horas.</p>
            
            <h3>Juguetes para gatos</h3>
            <p>Una caja de cartón con agujeros de diferentes tamaños se convierte en el juguete perfecto para tu gato. También puedes hacer una pelota con papel de aluminio.</p>
            
            <h3>Materiales seguros</h3>
            <p>Siempre usa materiales no tóxicos y evita objetos pequeños que puedan ser ingeridos. Supervisa a tu mascota mientras juega.</p>
            
            <h3>Rotación de juguetes</h3>
            <p>Cambia los juguetes regularmente para mantener el interés de tu mascota. Guarda algunos y rótalos cada semana.</p>
        `,
    imagen:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&crop=center",
    fecha: "2024-01-05",
    categoria: "Juguetes",
    autor: "Entrenadora de Mascotas Carlos Ruiz",
  },
  {
    id: 4,
    titulo: "Cómo Adiestrar a tu Perro: Técnicas Básicas",
    resumen:
      "Aprende las técnicas fundamentales para adiestrar a tu perro de manera efectiva y positiva.",
    contenido: `
            <h3>Refuerzo positivo</h3>
            <p>El refuerzo positivo es la base del adiestramiento moderno. Premia las conductas deseadas con golosinas, elogios o caricias.</p>
            
            <h3>Comandos básicos</h3>
            <p>Comienza con comandos simples como "siéntate", "quieto" y "ven". Sé consistente con las palabras y gestos que uses.</p>
            
            <h3>Sesiones cortas</h3>
            <p>Las sesiones de adiestramiento deben ser cortas (10-15 minutos) y frecuentes. Es mejor hacer varias sesiones cortas que una larga.</p>
            
            <h3>Paciencia y constancia</h3>
            <p>Cada perro aprende a su ritmo. Sé paciente y no te desanimes si no ve resultados inmediatos. La constancia es clave.</p>
        `,
    imagen:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop&crop=center",
    fecha: "2024-01-01",
    categoria: "Consejos",
    autor: "Entrenador Profesional Laura Fernández",
  },
]

export default blogPosts