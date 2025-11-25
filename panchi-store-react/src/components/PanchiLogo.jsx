// Logo Profesional Premium para Panchi Store - Diseño Sofisticado y Moderno
function PanchiLogo({ className = '', style = {} }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradientes profesionales */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CD853F" />
          <stop offset="50%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#5A2D0A" />
        </linearGradient>
        <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <radialGradient id="shineGrad" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {/* Sombra suave */}
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Fondo circular elegante con borde */}
      <circle
        cx="70"
        cy="70"
        r="65"
        fill="#FFFFFF"
        stroke="url(#collarGrad)"
        strokeWidth="3"
      />
      
      {/* Sombra del fondo */}
      <circle
        cx="70"
        cy="72"
        r="65"
        fill="#000000"
        opacity="0.1"
      />
      
      {/* Cuerpo del perro salchicha - diseño limpio y profesional */}
      <ellipse
        cx="70"
        cy="88"
        rx="32"
        ry="14"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2.5"
        filter="url(#shadow)"
      />
      
      {/* Cabeza - proporciones perfectas */}
      <circle
        cx="70"
        cy="42"
        r="20"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2.5"
        filter="url(#shadow)"
      />
      
      {/* Brillo en la cabeza */}
      <ellipse
        cx="70"
        cy="38"
        rx="12"
        ry="8"
        fill="url(#shineGrad)"
      />
      
      {/* Hocico elegante */}
      <ellipse
        cx="58"
        cy="42"
        rx="10"
        ry="7"
        fill="#D2691E"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      
      {/* Nariz profesional */}
      <ellipse
        cx="52"
        cy="42"
        rx="4"
        ry="3.5"
        fill="#2F1B14"
      />
      <ellipse
        cx="53"
        cy="41.5"
        rx="1.5"
        ry="1"
        fill="#FFFFFF"
        opacity="0.8"
      />
      
      {/* Ojos profesionales y expresivos */}
      <circle
        cx="63"
        cy="38"
        r="4"
        fill="#2F1B14"
      />
      <circle
        cx="63"
        cy="38"
        r="2"
        fill="#FFFFFF"
      />
      <circle
        cx="63.5"
        cy="37.5"
        r="1.2"
        fill="#4682B4"
      />
      <circle
        cx="64"
        cy="37"
        r="0.6"
        fill="#FFFFFF"
      />
      
      <circle
        cx="74"
        cy="38"
        r="4"
        fill="#2F1B14"
      />
      <circle
        cx="74"
        cy="38"
        r="2"
        fill="#FFFFFF"
      />
      <circle
        cx="74.5"
        cy="37.5"
        r="1.2"
        fill="#4682B4"
      />
      <circle
        cx="75"
        cy="37"
        r="0.6"
        fill="#FFFFFF"
      />
      
      {/* Orejas elegantes y caídas */}
      <path
        d="M 55 28 Q 48 20 42 28 Q 44 38 55 40 Q 60 32 55 28 Z"
        fill="#5A2D0A"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      <path
        d="M 53 32 Q 50 26 45 30 Q 47 35 53 37 Z"
        fill="#8B4513"
        opacity="0.6"
      />
      
      <path
        d="M 85 28 Q 92 20 98 28 Q 96 38 85 40 Q 80 32 85 28 Z"
        fill="#5A2D0A"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      <path
        d="M 87 32 Q 90 26 95 30 Q 93 35 87 37 Z"
        fill="#8B4513"
        opacity="0.6"
      />
      
      {/* Patas delanteras - diseño limpio */}
      <ellipse
        cx="58"
        cy="100"
        rx="6"
        ry="10"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      <ellipse
        cx="82"
        cy="100"
        rx="6"
        ry="10"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      
      {/* Patas traseras */}
      <ellipse
        cx="50"
        cy="103"
        rx="5.5"
        ry="9"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      <ellipse
        cx="90"
        cy="103"
        rx="5.5"
        ry="9"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2"
      />
      
      {/* Cola elegante */}
      <path
        d="M 102 88 Q 112 78 115 90 Q 110 98 104 94 Q 102 91 102 88"
        fill="url(#bodyGrad)"
        stroke="#2F1B14"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Manchas sutiles y elegantes */}
      <ellipse
        cx="78"
        cy="72"
        rx="9"
        ry="5"
        fill="#A0522D"
        opacity="0.6"
      />
      <ellipse
        cx="65"
        cy="85"
        rx="7"
        ry="4"
        fill="#A0522D"
        opacity="0.5"
      />
      
      {/* Sonrisa profesional y amigable */}
      <path
        d="M 56 48 Q 70 53 84 48"
        stroke="#2F1B14"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Collar PREMIUM elegante */}
      <ellipse
        cx="70"
        cy="55"
        rx="16"
        ry="10"
        fill="none"
        stroke="url(#collarGrad)"
        strokeWidth="3.5"
      />
      
      {/* Placa del collar - diseño premium */}
      <ellipse
        cx="70"
        cy="55"
        rx="9"
        ry="6"
        fill="url(#collarGrad)"
        stroke="#8B4513"
        strokeWidth="2"
      />
      <text
        x="70"
        y="59"
        textAnchor="middle"
        fontSize="9"
        fill="#8B4513"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.5"
      >
        P
      </text>
      
      {/* Decoraciones del collar - elegantes */}
      <circle
        cx="58"
        cy="53"
        r="2.5"
        fill="#FFD700"
      />
      <circle
        cx="64"
        cy="54"
        r="2"
        fill="#FFD700"
      />
      <circle
        cx="76"
        cy="54"
        r="2"
        fill="#FFD700"
      />
      <circle
        cx="82"
        cy="53"
        r="2.5"
        fill="#FFD700"
      />
    </svg>
  )
}

export default PanchiLogo

