// export const BookSwapLogo = ({ className = "w-64 text-black dark:text-white" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 450 100"
//     className={className}
//     fill="currentColor"
//   >
//     <g transform="translate(10, 15)">
//       {/* Left side: Book spine and cover */}
//       <path d="M 15 10 h 15 v 60 h -15 a 8 8 0 0 1 -8 -8 v -44 a 8 8 0 0 1 8 -8 z" />
//       {/* Right side: Pages sweeping into an upward swap arrow */}
//       <path d="M 35 70 h 20 a 20 20 0 0 0 20 -20 v -10 h 10 L 60 10 L 35 40 h 15 v 10 h -15 v 20 z" />
//     </g>
//     <text
//       x="110"
//       y="68"
//       fontFamily="-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, sans-serif"
//       fontSize="46"
//       fontWeight="800"
//       letterSpacing="1.5"
//     >
//       BOOKSWAP
//     </text>
//   </svg>
// );

export const BookSwapLogo = ({ className = "w-72 text-black dark:text-white" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 780 200"
    className={className}
    fill="none"
  >
    {/* Icon Path */}
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
    
    {/* Typography */}
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