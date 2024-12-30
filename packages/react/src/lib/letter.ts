export const getFirstLetters = (inputString: string): { initials: string } => {
  // const getRandomColor = (): string => {
  //   const letters = "0123456789ABCDEF";
  //   let color = "#";
  //   for (let i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  const words = inputString.split(" ");
  if (words.length < 2) {
    return { initials: "" }; // Return empty if not two words
  }

  const initials =
    words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  // const color1 = getRandomColor();
  // const color2 = getRandomColor();

  return { initials };
};
