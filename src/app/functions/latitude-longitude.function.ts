export function pasteDms(pastedData: string): {
  latitude: number;
  longitude: number;
} {
  const words: string[] = pastedData
    .replace(/[\r\n]+/g, '')
    .replace(/\s+/g, '')
    .split(',');
  if (words.length <= 1) {
    return { latitude: 0, longitude: 0 };
  }

  return {
    latitude: Number(words[0]),
    longitude: Number(words[1]),
  };
}

export function dmsToDecimal(dms: string): {
  latitude: number;
  longitude: number;
} {
  const regex = /(\d+)°(\d+)'([\d.]+)"([NSWE])/g;
  let match;
  let latitude = 0;
  let longitude = 0;

  while ((match = regex.exec(dms)) !== null) {
    const degrees = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseFloat(match[3]);
    const direction = match[4];

    const decimal = degrees + minutes / 60 + seconds / 3600;

    if (direction === 'N' || direction === 'S') {
      latitude = direction === 'S' ? -decimal : decimal;
    } else if (direction === 'E' || direction === 'W') {
      longitude = direction === 'W' ? -decimal : decimal;
    }
  }

  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  };
}
