import React, { useRef, useEffect } from 'react';

export default function OtpInput({
  value = '',
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  length = 6,
  autoFocus = true
}) {
  const inputRefs = useRef([]);

  // Ensure value is padded array of digits
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/[^0-9]/g, '');
    if (!char) return;

    const singleDigit = char[char.length - 1]; // take the newest character
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    const newOtp = newDigits.join('');
    
    onChange(newOtp);

    // Auto-advance to next box
    if (singleDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }

    // Trigger onComplete if full code entered
    if (newOtp.length === length && !newOtp.includes(' ') && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current box is empty, move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    
    // Focus appropriate box
    const focusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all shadow-xs outline-none ${
            hasError
              ? 'border-red-400 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-400/40 focus:border-red-500'
              : digits[i]
              ? 'border-indigo-600 bg-indigo-50/30 text-indigo-900 shadow-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600'
              : 'border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
