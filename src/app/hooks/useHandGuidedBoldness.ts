"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { FormValues, ratingScale } from "../constants/form";

type HandPosition = {
  top: number;
  left: number;
};

const HAND_TIP_OFFSET = {
  x: 20,
  y: 80,
};

const HAND_ENTRY_VARIANTS = [
  "translate3d(220vw, -4vh, 0)", // slide from right
  "translate3d(220vw, 12vh, 0)", // slide from right-bottom
  "translate3d(-120vw, -6vh, 0)", // slide from left
  "translate3d(-10vw, 120vh, 0)", // rise from bottom
] as const;

type HandEntryTransform = (typeof HAND_ENTRY_VARIANTS)[number];

type UseHandGuidedBoldnessParams = {
  setValue: UseFormSetValue<FormValues>;
};

export const HAND_PRESS_DELTA = {
  x: -30,
  y: 8,
};

export function useHandGuidedBoldness({
  setValue,
}: UseHandGuidedBoldnessParams) {
  const [isBlockingInteractions, setIsBlockingInteractions] = useState(false);
  const [handPosition, setHandPosition] = useState<HandPosition | null>(null);
  const [handInPlace, setHandInPlace] = useState(false);
  const [handPressing, setHandPressing] = useState(false);
  const [tapRipplePosition, setTapRipplePosition] =
    useState<HandPosition | null>(null);
  const [handEntryTransform, setHandEntryTransform] =
    useState<HandEntryTransform>(HAND_ENTRY_VARIANTS[0]);
  const boldnessFiveRef = useRef<HTMLInputElement | null>(null);
  const handTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!isBlockingInteractions) {
      return;
    }

    const preventDefault = (event: Event) => {
      event.preventDefault();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("wheel", preventDefault, { passive: false });
    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("wheel", preventDefault);
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isBlockingInteractions]);

  useEffect(() => {
    return () => {
      handTimersRef.current.forEach((timerId) => {
        clearTimeout(timerId);
      });
      handTimersRef.current = [];
    };
  }, []);

  const handleBoldnessOverride = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedValue = event.target.value as (typeof ratingScale)[number];

      if (selectedValue === "5" || isBlockingInteractions) {
        return;
      }

      setIsBlockingInteractions(true);

      const targetRect = boldnessFiveRef.current?.getBoundingClientRect();
      if (!targetRect) {
        setValue("boldness", "5");
        setIsBlockingInteractions(false);
        return;
      }

      handTimersRef.current.forEach((timerId) => {
        clearTimeout(timerId);
      });
      handTimersRef.current = [];

      setTapRipplePosition(null);
      setHandEntryTransform(
        HAND_ENTRY_VARIANTS[
          Math.floor(Math.random() * HAND_ENTRY_VARIANTS.length)
        ],
      );
      setHandPosition({
        top: targetRect.top + targetRect.height / 2 - HAND_TIP_OFFSET.y,
        left: targetRect.left + targetRect.width / 2 - HAND_TIP_OFFSET.x,
      });
      setHandInPlace(false);
      setHandPressing(false);

      requestAnimationFrame(() => {
        setHandInPlace(true);
      });

      const pressTimer = setTimeout(() => {
        setHandPressing(true);
        const currentRect =
          boldnessFiveRef.current?.getBoundingClientRect() ?? targetRect;
        if (currentRect) {
          setTapRipplePosition({
            top: currentRect.top + currentRect.height / 2,
            left: currentRect.left + currentRect.width / 2,
          });
        }
        boldnessFiveRef.current?.click();
      }, 650);

      const retreatTimer = setTimeout(() => {
        setHandPressing(false);
        setHandInPlace(false);
      }, 1100);

      const rippleCleanupTimer = setTimeout(() => {
        setTapRipplePosition(null);
      }, 1200);

      const cleanupTimer = setTimeout(() => {
        setHandPosition(null);
        setIsBlockingInteractions(false);
      }, 1500);

      handTimersRef.current.push(
        pressTimer,
        retreatTimer,
        rippleCleanupTimer,
        cleanupTimer,
      );
    },
    [isBlockingInteractions, setValue],
  );

  return {
    boldnessFiveRef,
    handleBoldnessOverride,
    handEntryTransform,
    handInPlace,
    handPosition,
    handPressing,
    isBlockingInteractions,
    tapRipplePosition,
  } as const;
}
