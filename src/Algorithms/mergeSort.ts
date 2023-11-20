import { ISteps } from "./../Interface/steps";

const sort = (
  arr: number[],
  newArr: number[],
  start: number,
  end: number,
  steps: ISteps[]
) => {
  if (end <= start) return; // if array has one or zero elements.
  const mid = Math.floor(start + (end - start) / 2);

  sort(arr, newArr, start, mid, steps); // left half of the array
  sort(arr, newArr, mid + 1, end, steps); // right half of the array

  merge(arr, newArr, start, mid, end, steps);
};

const merge = (
  arr: number[],
  newArr: number[],
  start: number,
  mid: number,
  end: number,
  steps: ISteps[]
) => {
  // Copy the array to a new array
  for (let k = start; k <= end; k++) {
    newArr[k] = arr[k];
  }

  let i = start; // pointer for start of left array
  let j = mid + 1; // pointer for start of right array

  for (let k = start; k <= end; k++) {
    // Compare elements from the left and right
    if (i > mid) {
      steps.push({ type: "compare", indexes: [j, j] });
      steps.push({ type: "swap", indexes: [k, newArr[j]] });
      steps.push({ type: "return", indexes: [j, j] });
      steps.push({ type: "return", indexes: [k, k] });

      arr[k] = newArr[j++];
    } else if (j > end) {
      steps.push({ type: "compare", indexes: [i, i] });
      steps.push({ type: "swap", indexes: [k, newArr[i]] });
      steps.push({ type: "return", indexes: [i, i] });
      steps.push({ type: "return", indexes: [k, k] });

      arr[k] = newArr[i++];
    }
    // If the ele in the right is smaller, copy it and move the pointer
    else if (newArr[j] < newArr[i]) {
      steps.push({ type: "compare", indexes: [i, j] });
      steps.push({ type: "swap", indexes: [k, newArr[j]] });
      steps.push({ type: "return", indexes: [i, j] });
      steps.push({ type: "return", indexes: [k, k] });
      arr[k] = newArr[j++];
    }
    // If the ele in the left is smaller or equal, copy it and move the pointer
    else {
      steps.push({ type: "compare", indexes: [i, j] });
      steps.push({ type: "swap", indexes: [k, newArr[i]] });
      steps.push({ type: "return", indexes: [i, j] });
      steps.push({ type: "return", indexes: [k, k] });
      arr[k] = newArr[i++];
    }
    // Record steps for visualization
  }
};

export const mergeSortSteps = (arr: number[]) => {
  const newArr = [...arr];
  const steps: ISteps[] = [];
  sort(arr, newArr, 0, arr.length - 1, steps);
  return steps;
};
