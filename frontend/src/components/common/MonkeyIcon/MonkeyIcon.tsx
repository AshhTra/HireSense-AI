type MonkeyIconProps = {
  isClosed: boolean;
  className?: string;
};

export default function MonkeyIcon({ isClosed, className = "w-7 h-7" }: MonkeyIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-all duration-300 transform active:scale-90`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Ears */}
      <circle cx="16" cy="50" r="13" fill="#C86D28" />
      <circle cx="16" cy="50" r="8" fill="#FCEADE" />
      <circle cx="84" cy="50" r="13" fill="#C86D28" />
      <circle cx="84" cy="50" r="8" fill="#FCEADE" />

      {/* Head Outer Base */}
      <circle cx="50" cy="50" r="36" fill="#D97706" />

      {/* Expanded Light Face Mask (बड़ा Light Area) */}
      <path
        d="M26 44 C26 30, 44 30, 50 38 C56 30, 74 30, 74 44 C74 68, 26 68, 26 44 Z"
        fill="#FDE68A"
      />
      <circle cx="50" cy="56" r="21" fill="#FDE68A" />

      {/* Eyes & Mouth */}
      {!isClosed ? (
        <>
          {/* Open Big Cute Eyes */}
          <circle cx="40" cy="45" r="5" fill="#1E293B" />
          <circle cx="60" cy="45" r="5" fill="#1E293B" />
          {/* Eye Sparkles */}
          <circle cx="42" cy="43" r="1.8" fill="white" />
          <circle cx="62" cy="43" r="1.8" fill="white" />
          {/* Big Happy Smile */}
          <path
            d="M 38 60 Q 50 70 62 60"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        /* Curved Closed Eyes */
        <>
          <path
            d="M 36 46 Q 40 50 44 46"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 56 46 Q 60 50 64 46"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Small Surprised/Shy Mouth */}
          <ellipse cx="50" cy="62" rx="4" ry="3" fill="#1E293B" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="50" cy="52" rx="4" ry="2.5" fill="#78350F" />

      {/* Hands Animation with High Contrast */}
      {isClosed ? (
        /* Hands COVERING EYES (Image 1 style with clear contrast) */
        <g className="transition-all duration-300">
          {/* Left Arm & Palm */}
          <path
            d="M 12 76 Q 24 38 43 40 Q 47 50 32 68 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="2"
          />
          <circle cx="39" cy="42" r="5.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="33" cy="40" r="5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="28" cy="42" r="4.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />

          {/* Right Arm & Palm */}
          <path
            d="M 88 76 Q 76 38 57 40 Q 53 50 68 68 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="2"
          />
          <circle cx="61" cy="42" r="5.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="67" cy="40" r="5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="72" cy="42" r="4.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1.5" />
        </g>
      ) : (
        /* Hands DOWN/OPEN (Image 2 style) */
        <g className="transition-all duration-300">
          {/* Left Paws Down */}
          <circle cx="20" cy="74" r="8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="15" cy="70" r="4" fill="#FDE68A" />
          <circle cx="20" cy="67" r="4" fill="#FDE68A" />
          <circle cx="25" cy="69" r="4" fill="#FDE68A" />

          {/* Right Paws Down */}
          <circle cx="80" cy="74" r="8" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="75" cy="69" r="4" fill="#FDE68A" />
          <circle cx="80" cy="67" r="4" fill="#FDE68A" />
          <circle cx="85" cy="70" r="4" fill="#FDE68A" />
        </g>
      )}
    </svg>
  );
}