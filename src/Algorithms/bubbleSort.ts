import { ISteps } from "./../Interface/steps";

const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const bubbleSort = (arr: number[], steps: ISteps[]) => {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      steps.push({ type: "compare", indexes: [j, j + 1] });

      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        steps.push({ type: "swap", indexes: [j, j + 1] });
      }

      steps.push({ type: "return", indexes: [j, j + 1] });
    }
  }
};

export const bubbleSortSteps = (arr: number[]) => {
  let steps: ISteps[] = [];
  bubbleSort(arr, steps);
  return steps;
};
