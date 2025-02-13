import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ProperButton = ({ text, name, imgSrc }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="border-2 border-[rgb(255,255,255)] py-[0.4vw] px-3 relative overflow-hidden rounded-xs mb-3 gap-2 flex justify-center items-center w-3vw text-white uppercase"
    >
      {/* Image inside button */}
      {imgSrc && (
        <img 
          src={imgSrc} 
          alt="button-icon" 
          className="w-9 h-9 rounded-[5px] z-10 relative mx-1"
        />
      )}

      <p style={{ color: hover ? 'black' : 'white' }} className="z-10 relative flex justify-center text-[1vw] font-medium tracking-wider items-center">
        {text}
      </p>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ y: "100%", borderRadius: "100%" }}
            animate={{ y: "0%", borderRadius: "0%" }}
            exit={{ y: "100%", borderRadius: "100%" }}
            transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.8 }}
            className="absolute bottom-0 right-0 bg-white w-full h-full flex justify-center z-0"
          />
        )}
      </AnimatePresence>
    </button>
  );
};

export default ProperButton;
