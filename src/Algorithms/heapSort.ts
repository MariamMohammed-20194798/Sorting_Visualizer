import { ISteps } from './../Interface/steps';

const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const heapify = (arr: number[], n: number, i: number, steps: ISteps[]) => {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // Left child
  const right = 2 * i + 2; // Right child

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

  // If largest is not root, swap and recursively heapify
  if (largest !== i) {
    steps.push({ type: 'compare', indexes: [i, largest] });
    swap(arr, i, largest);
    steps.push({ type: 'swap', indexes: [i, largest] });
    steps.push({ type: 'return', indexes: [i, largest] });

    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest, steps);
  }
};

const heapSort = (arr: number[], steps: ISteps[]) => {
  const n = arr.length;

  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({ type: 'compare', indexes: [0, i] });
    swap(arr, 0, i);
    steps.push({ type: 'swap', indexes: [0, i] });
    steps.push({ type: 'return', indexes: [0, i] });

    // Call max heapify on the reduced heap
    heapify(arr, i, 0, steps);
  }
};

export const heapSortSteps = (arr: number[]) => {
  let steps: ISteps[] = [];
  heapSort(arr, steps);
  return steps;
};
