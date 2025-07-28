import { ISteps } from './../Interface/steps';

const insertionSort = (arr: number[], steps: ISteps[]) => {
  const len = arr.length;

  for (let i = 1; i < len; i++) {
    const key = arr[i];
    let j = i - 1;

    // Compare key with elements before it
    while (j >= 0) {
      steps.push({ type: 'compare', indexes: [j, i] });

      if (arr[j] > key) {
        // Move element to the right
        arr[j + 1] = arr[j];
        steps.push({ type: 'swap', indexes: [j + 1, j] });
        steps.push({ type: 'return', indexes: [j + 1, j] });
        j--;
      } else {
        steps.push({ type: 'return', indexes: [j, i] });
        break;
      }
    }

    // Place key at its correct position
    arr[j + 1] = key;
  }
};

export const insertionSortSteps = (arr: number[]) => {
  const steps: ISteps[] = [];
  insertionSort(arr, steps);
  return steps;
};
