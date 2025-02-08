// Simulated translation API call
export const translateText = async (
  text: string,
  targetLanguage: string,
): Promise<string> => {
  // In a real app, this would call a translation API
  // For demo purposes, we'll just append the language code
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${text} (${targetLanguage})`);
    }, 500);
  });
};
