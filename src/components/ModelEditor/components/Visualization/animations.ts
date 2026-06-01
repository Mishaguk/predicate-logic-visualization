export const popupVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

export const popupTransition = { duration: 0.18, ease: "easeOut" } as const;
