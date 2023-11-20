import React, { FC, useState, useRef } from "react";
import "./sortingVisualizer.css";
import { mergeSortSteps } from "../Algorithms/mergeSort";
import { quicksortSteps } from "../Algorithms/quickSort";
import { bubbleSortSteps } from "../Algorithms/bubbleSort";
import { selectionSortSteps } from "../Algorithms/selectionSort";
import { ISteps } from "./../Interface/steps";

export interface VisualizerProps {}

const PRIMARY_COLOR = "pink";
const FIRST_COLOR = "darkgray";
const SECOND_COLOR = "yellow";

const randomNumbers = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateArray = () => {
  const len = 35;
  const array = new Array(len);
  for (let i = 0; i < len; i++) {
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

export const SortingVisualizer: FC<VisualizerProps> = () => {
  const [arr, setArr] = useState(generateArray());
  const [speed, setSpeed] = useState(30);
  const [isSorted, setIsSorted] = useState(false);
  const [selected, setSelected] = useState("");
  const arrayBars = useRef<HTMLDivElement>(null);

  const arrayHandler = () => {
    setArr(generateArray());
  };

  const speedHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Math.max(1, +e.target.value));
  };
  // ######################################################################
  const mergeSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const tempArr = [...arr];
    const steps: ISteps[] = mergeSortSteps(tempArr);
    const bars = arrayBars.current!.children as any;
    console.log(steps);
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
    setArr(tempArr);
    setIsSorted(false);
  };
  // ######################################################################
  const sortingAlgorithmHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    const tempArr = [...arr];
    let steps: ISteps[] = [];
    const bars = arrayBars.current!.children as any;

    if (algorithm === "quickSort") steps = quicksortSteps(tempArr);
    else if (algorithm === "bubbleSort") steps = bubbleSortSteps(tempArr);
    else if (algorithm === "selectionSort") steps = selectionSortSteps(tempArr);

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === "swap") {
        bars[i].style.backgroundColor = SECOND_COLOR;
        bars[j].style.backgroundColor = SECOND_COLOR;
        swapEles(bars, i, j);
      } else if (type === "compare") {
        bars[i].style.backgroundColor = FIRST_COLOR;
        bars[j].style.backgroundColor = FIRST_COLOR;
      } else if (type === "return") {
        bars[i].style.backgroundColor = PRIMARY_COLOR;
        bars[j].style.backgroundColor = PRIMARY_COLOR;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setArr(tempArr);
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
          id="speed"
          name="speed"
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
          onClick={() => sortingAlgorithmHandler("quickSort")}
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
          onClick={() => sortingAlgorithmHandler("bubbleSort")}
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
          onClick={() => sortingAlgorithmHandler("selectionSort")}
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
