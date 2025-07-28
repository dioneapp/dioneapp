import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCountProps {
  value: number;
  suffix?: string;
  className?: string;
}

const AnimatedCount = ({ value, suffix = "", className = "" }: AnimatedCountProps) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 20,
    stiffness: 100,
  });

  const [display, setDisplay] = useState("0.00");

  const rounded = useTransform(spring, (latest) => latest.toFixed(2));

  useEffect(() => {
    motionValue.set(value);
  }, [value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      setDisplay(v);
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <p className={`${className}`}>
      {display} {suffix}
    </p>
  );
};

export default AnimatedCount;
