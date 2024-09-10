export function generateColors(
    startColor: string,
    endColor: string,
    numberOfColors: number,
  ): string[] {
    if (startColor[0] !== "#" || endColor[0] !== "#") {
      throw new Error("Colors must be in hex format");
    }
  
    const colors: string[] = [];
  
    const startRed = parseInt(startColor.substring(1, 3), 16);
    const startGreen = parseInt(startColor.substring(3, 5), 16);
    const startBlue = parseInt(startColor.substring(5, 7), 16);
  
    const endRed = parseInt(endColor.substring(1, 3), 16);
    const endGreen = parseInt(endColor.substring(3, 5), 16);
    const endBlue = parseInt(endColor.substring(5, 7), 16);
  
    if (numberOfColors <= 0) {
      // throw new Error("numberOfColors must be greater than 0");
      colors.push(startColor);
      return colors;
    }
  
    if (numberOfColors === 1) {
      colors.push(startColor);
      return colors;
    }
  
    if (numberOfColors === 2) {
      colors.push(startColor);
      colors.push(endColor);
      return colors;
    }
  
    for (let i = 0; i < numberOfColors; i++) {
      const ratio = i / (numberOfColors - 1);
      if (isNaN(ratio)) {
        throw new Error("Unexpected error, ratio is NaN");
      }
      const interpolatedRed = Math.round(startRed * (1 - ratio) + endRed * ratio);
      const interpolatedGreen = Math.round(
        startGreen * (1 - ratio) + endGreen * ratio,
      );
      const interpolatedBlue = Math.round(
        startBlue * (1 - ratio) + endBlue * ratio,
      );
  
      const interpolatedColor =
        "#" +
        formatHex(interpolatedRed) +
        formatHex(interpolatedGreen) +
        formatHex(interpolatedBlue);
  
      colors.push(interpolatedColor);
    }
    return colors;
  }


  const formatHex = (number: number): string => {
    const hexadecimal = number.toString(16);
    return hexadecimal.padStart(2, "0");
  };