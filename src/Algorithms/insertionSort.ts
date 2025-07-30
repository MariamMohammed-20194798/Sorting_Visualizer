import { ISteps } from './../Interface/steps';

const insertionSort = (arr: number[], steps: ISteps[]) => {
  const len = arr.length;

  for (let i = 1; i < len; i++) {
    const key = arr[i];
    let j = i - 1;

    // Compare with the key element
    steps.push({ type: 'compare', indexes: [i, j] });

    // Move elements that are greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: 'compare', indexes: [j, j + 1] });

      // Swap elements
      arr[j + 1] = arr[j];
      steps.push({ type: 'swap', indexes: [j, j + 1] });

      steps.push({ type: 'return', indexes: [j, j + 1] });
      j--;

      // Compare with next element if exists
      if (j >= 0) {
        steps.push({ type: 'compare', indexes: [j, i] });
      }
    }

    // Place key at its correct position
    arr[j + 1] = key;
    if (j + 1 !== i) {
      steps.push({ type: 'swap', indexes: [j + 1, i] });
    }

    steps.push({ type: 'return', indexes: [j + 1, i] });
  }
};

export const insertionSortSteps = (arr: number[]) => {
  let steps: ISteps[] = [];
  insertionSort(arr, steps);
  return steps;
};
