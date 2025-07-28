import { ISteps } from './../Interface/steps';

const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const heapify = (arr: number[], n: number, i: number, steps: ISteps[]) => {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Compare with left child
  if (left < n) {
    steps.push({ type: 'compare', indexes: [left, largest] });
    if (arr[left] > arr[largest]) {
      largest = left;
    }
    steps.push({ type: 'return', indexes: [left, largest] });
  }

  // Compare with right child
  if (right < n) {
    steps.push({ type: 'compare', indexes: [right, largest] });
    if (arr[right] > arr[largest]) {
      largest = right;
    }
    steps.push({ type: 'return', indexes: [right, largest] });
  }

  // If largest is not root
  if (largest !== i) {
    steps.push({ type: 'swap', indexes: [i, largest] });
    swap(arr, i, largest);
    steps.push({ type: 'return', indexes: [i, largest] });

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest, steps);
  }
};

const heapSort = (arr: number[], steps: ISteps[]) => {
  const n = arr.length;

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({ type: 'swap', indexes: [0, i] });
    swap(arr, 0, i);
    steps.push({ type: 'return', indexes: [0, i] });

    // call max heapify on the reduced heap
    heapify(arr, i, 0, steps);
  }
};

export const heapSortSteps = (arr: number[]) => {
  const steps: ISteps[] = [];
  heapSort(arr, steps);
  return steps;
};
