interface ISteps {
  type: string;
  indexes: [idx1: number, idx2: number];
}

const swap = (arr: number[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const bubbleSort = (arr: number[], steps: ISteps[]) => {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
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
  const newArr = [...arr];
  console.log(newArr);
  let steps: ISteps[] = [];
  bubbleSort(newArr, steps);
  console.log(newArr);
  return steps;
};
