export const BookSwapLogo = ({ className = "w-72 text-black dark:text-white" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 780 200"
    className={className}
    fill="none"
  >
    <path
      d="
        M 30 40
        C 30 25, 40 20, 50 20
        L 115 20
        C 130 20, 130 35, 115 35
        L 55 35
        L 55 45
        L 125 45
        C 135 45, 135 50, 135 60
        L 135 70
        L 120 70
        L 120 60
        L 55 60
        L 55 125
        C 55 150, 95 155, 120 115
        L 105 115
        L 130 75
        L 155 115
        L 140 115
        C 130 155, 100 175, 60 175
        C 40 175, 30 160, 30 140
        Z
      " 
      fill="currentColor"
    />

    <text
      x="180" 
      y="125" 
      fontFamily="'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" 
      fontSize="82" 
      fontWeight="600" 
      letterSpacing="1.5" 
      fill="currentColor"
    >
      BOOKSWAP
    </text>
  </svg>
);