export const log = (...args) => {
    if (import.meta.env.MODE === "development") {
      console.log(...args);
    }
  };
  