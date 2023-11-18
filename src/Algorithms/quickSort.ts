interface ISteps {
  type: string;
  indexes: [idx1: number, idx2: number];
}
const swap = (arr: any[], i: number, j: number) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const sort = (arr: number[], start: number, end: number, steps: ISteps[]) => {
  if (end <= start) return;

  const pivotIndex = partition(arr, start, end, steps);
  sort(arr, start, pivotIndex - 1, steps);
  sort(arr, pivotIndex + 1, end, steps);
};

const partition = (
  arr: number[],
  start: number,
  end: number,
  steps: ISteps[]
) => {
  steps.push({ type: "compare", indexes: [start, start] });

  let i = start;
  let j = end + 1;

  const pivot = arr[start];
  while (true) {
    while (arr[++i] < pivot) if (i === end) break;
    while (pivot < arr[--j]) if (j === start) break;
    if (i >= j) break;

    steps.push({ type: "swap", indexes: [i, j] });
    steps.push({ type: "return", indexes: [i, j] });

    swap(arr, i, j);
  }

  steps.push({ type: "swap", indexes: [start, j] });
  steps.push({ type: "return", indexes: [start, j] });

  swap(arr, start, j);

  return j;
};

export const quicksortSteps = (arr: number[]) => {
  const steps: ISteps[] = [];
  const newArr = [...arr];
  console.log(newArr);
  sort(newArr, 0, newArr.length - 1, steps);
  console.log(newArr);
  return steps;
};
