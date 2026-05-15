import { motion } from 'framer-motion';

export default function Loader({ fullPage = false, size = 32 }) {
  const spinner = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ display: 'block' }}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="56.5"
        strokeDashoffset="20"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      />
    </svg>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D0D0F',
          zIndex: 9999,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {spinner}
          <span style={{ color: '#8A8A96', fontSize: 13, fontFamily: 'Manrope, sans-serif', letterSpacing: '0.1em' }}>
            LOADING
          </span>
        </div>
      </div>
    );
  }

  return spinner;
}
