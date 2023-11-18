import React, { FC, useState, useRef } from "react";
import "./sortingVisualizer.css";
import { mergeSortSteps } from "../Algorithms/mergeSort";
import { quicksortSteps } from "../Algorithms/quickSort";
import { bubbleSortSteps } from "../Algorithms/bubbleSort";
import { selectionSortSteps } from "../Algorithms/selectionSort";

export interface VisualizerProps {}

const PRIMARY_COLOR = "pink";
const FIRST_COLOR = "darkgray";
const SECOND_COLOR = "yellow";

const randomNumbers = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateArray = () => {
  const size = 6;
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = randomNumbers(5, 700);
  }
  return array;
};

function swapEles(ele: any, i: number, j: number) {
  const tempHeight = ele[i].style.height;
  ele[i].style.height = ele[j].style.height;
  ele[j].style.height = tempHeight;

  const tempTextContent = ele[i].children[0].textContent;
  ele[i].children[0].textContent = ele[j].children[0].textContent;
  ele[j].children[0].textContent = tempTextContent;
}
const quickSwap = (ele: any[], i: number, j: number) => {
  const temp = ele[i].style.height;
  ele[i].style.height = ele[j].style.height;
  ele[j].style.height = temp;
  ele[i].children[0].textContent = ele[j].textContent;
  ele[j].children[0].textContent = temp.replace("px", "");
};
export const SortingVisualizer: FC<VisualizerProps> = () => {
  const [arr, setArr] = useState(generateArray());
  const [speed, setSpeed] = useState(100);
  const [isSorted, setIsSorted] = useState(false);
  const [selected, setSelected] = useState("");
  const arrayBars = useRef<HTMLDivElement>(null);
  const bar = document.getElementsByClassName(
    "bar"
  ) as HTMLCollectionOf<HTMLElement>;

  const arrayHandler = () => {
    setArr(generateArray());
  };

  const speedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Math.max(1, +e.target.value));
  };
  // ######################################################################
  const mergeSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const steps = mergeSortSteps(arr);
    const bars = arrayBars.current!.children as any;

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === "swap") {
        bars[i].style.backgroundColor = SECOND_COLOR;
        bars[i].style.height = `${j}px`;
        bars[i].children[0].textContent = j;
      } else if (type === "compare") {
        bars[i].style.backgroundColor = FIRST_COLOR;
        bars[j].style.backgroundColor = FIRST_COLOR;
      } else if (type === "return") {
        bars[i].style.backgroundColor = PRIMARY_COLOR;
        bars[j].style.backgroundColor = PRIMARY_COLOR;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setIsSorted(false);
  };
  // ######################################################################

  const selectionSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const steps = selectionSortSteps(arr);

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === "compare") {
        bar[j].style.backgroundColor = FIRST_COLOR;
        bar[i].style.backgroundColor = FIRST_COLOR;
      } else if (type === "swap") {
        bar[j].style.backgroundColor = SECOND_COLOR;
        bar[i].style.backgroundColor = SECOND_COLOR;
        swapEles(bar, j, i);
      } else if (type === "return") {
        bar[j].style.backgroundColor = PRIMARY_COLOR;
        bar[i].style.backgroundColor = PRIMARY_COLOR;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setIsSorted(false);
  };
  // ######################################################################

  const bubbleSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const steps = bubbleSortSteps(arr);

    for (let i = 0; i < steps.length; i++) {
      let {
        type,
        indexes: [start, end],
      } = steps[i];

      if (type === "compare") {
        bar[start].style.backgroundColor = SECOND_COLOR;
        bar[end].style.backgroundColor = SECOND_COLOR;
      } else if (type === "swap") {
        bar[start].style.backgroundColor = FIRST_COLOR;
        bar[end].style.backgroundColor = FIRST_COLOR;
        swapEles(bar, start, end);
      } else if (type === "return") {
        bar[start].style.backgroundColor = PRIMARY_COLOR;
        bar[end].style.backgroundColor = PRIMARY_COLOR;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setIsSorted(false);
  };
  // ########################################################################

  const quickSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const steps = quicksortSteps(arr);
    const bars = arrayBars.current!.children as any;

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === "swap") {
        bar[i].style.backgroundColor = SECOND_COLOR;
        bar[j].style.backgroundColor = SECOND_COLOR;
        quickSwap(bars, i, j);
      } else if (type === "compare") {
        bar[i].style.backgroundColor = FIRST_COLOR;
        bar[j].style.backgroundColor = FIRST_COLOR;
      } else if (type === "return") {
        bar[i].style.backgroundColor = PRIMARY_COLOR;
        bar[j].style.backgroundColor = PRIMARY_COLOR;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setIsSorted(false);
  };
  // ########################################################################

  return (
    <div id="toolbar">
      <div id="divGenerate">
        <button id="generateArray" onClick={arrayHandler} disabled={isSorted}>
          Generate New Array
        </button>
        <label htmlFor="speed">Speed: </label>
        <input
          type="number"
          onChange={speedHandler}
          value={speed}
          disabled={isSorted}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.74)" }}
        />
      </div>
      <div id="divBtns">
        <button
          className={
            selected === "mergeSort"
              ? "currentAlgorithmButton"
              : "algorithmButton"
          }
          disabled={isSorted}
          onClick={() => mergeSortHandler("mergeSort")}
        >
          MergeSort
        </button>
        <button
          className={
            selected === "quickSort"
              ? "currentAlgorithmButton"
              : "algorithmButton"
          }
          disabled={isSorted}
          onClick={() => quickSortHandler("quickSort")}
        >
          QuickSort
        </button>
        <button
          className={
            selected === "bubbleSort"
              ? "currentAlgorithmButton"
              : "algorithmButton"
          }
          disabled={isSorted}
          onClick={() => bubbleSortHandler("bubbleSort")}
        >
          BubbleSort
        </button>
        <button
          className={
            selected === "selectionSort"
              ? "currentAlgorithmButton"
              : "algorithmButton"
          }
          disabled={isSorted}
          onClick={() => selectionSortHandler("selectionSort")}
        >
          SelectionSort
        </button>
      </div>
      <div className="array-container" ref={arrayBars}>
        {arr.map((number, idx) => (
          <div
            key={idx}
            className="bar"
            style={{
              height: `${number}px`,
              backgroundColor: PRIMARY_COLOR,
            }}
          >
            <p>{number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
