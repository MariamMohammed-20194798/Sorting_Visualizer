export interface ISteps {
  type: string;
  indexes: [idx1: number, idx2: number];
}

const swap = (arr: number[], i: number, minIdx: number) => {
  const temp = arr[i];
  arr[i] = arr[minIdx];
  arr[minIdx] = temp;
};

const selectionSort = (arr: number[], steps: ISteps[]) => {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < len; j++) {
      steps.push({ type: "compare", indexes: [j, minIdx] });

      if (arr[j] < arr[minIdx]) minIdx = j;

      steps.push({ type: "return", indexes: [j, minIdx] });
    }
    steps.push({ type: "swap", indexes: [i, minIdx] });
    swap(arr, i, minIdx);
    steps.push({ type: "return", indexes: [i, minIdx] });
  }
};

export const selectionSortSteps = (arr: number[]) => {
  const steps: ISteps[] = [];
  const newArr = [...arr];
  console.log(newArr);
  selectionSort(newArr, steps);
  console.log(newArr);
  return steps;
};
