export const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const range = (start: number, end: number) => {
  return Array.from({length: (end - start)}, (v, k) => k + start);
}

export const arrayPlus = (l1: number[], l2: number[]) => {
  let newArray = [];
  const len = Math.min(l1.length, l2.length);
  for (let i=0; i<len; i++) {
    newArray.push(l1[i] + l2[i])
  }
  return newArray;
}