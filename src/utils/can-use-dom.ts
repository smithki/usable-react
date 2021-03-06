export const CAN_USE_DOM = /* @__PURE__ */ Boolean(
  typeof window !== 'undefined' && window.document && window.document.createElement,
);
