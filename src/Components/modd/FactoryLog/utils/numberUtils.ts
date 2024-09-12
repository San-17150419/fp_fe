export function findAverage(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

export function findMedian(arr: number[]) {
  const sortedArr = arr.sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

export function findMax(arr: number[]) {
  return Math.max(...arr);
}

export function findMin(arr: number[]) {
  return Math.min(...arr);
}
