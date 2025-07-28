import React, { FC, useState, useRef, useEffect } from 'react';
import './sortingVisualizer.css';
import { mergeSortSteps } from '../Algorithms/mergeSort';
import { quicksortSteps } from '../Algorithms/quickSort';
import { bubbleSortSteps } from '../Algorithms/bubbleSort';
import { selectionSortSteps } from '../Algorithms/selectionSort';
import { heapSortSteps } from '../Algorithms/heapSort';
import { insertionSortSteps } from '../Algorithms/insertionSort';
import { ISteps } from './../Interface/steps';
import { FaPlay, FaPause, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { MdSpeed } from 'react-icons/md';
import { BiBarChartAlt2 } from 'react-icons/bi';

export interface VisualizerProps {}

// Color scheme
const PRIMARY_COLOR = '#6366f1';
const COMPARE_COLOR = '#f59e0b';
const SWAP_COLOR = '#ef4444';
const SORTED_COLOR = '#10b981';

// Algorithm information
const algorithmInfo = {
  mergeSort: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description:
      'Divide and conquer algorithm that divides the array into halves, sorts them, and then merges them.',
  },
  quickSort: {
    name: 'Quick Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description:
      'Picks a pivot element and partitions the array around it, then recursively sorts the partitions.',
  },
  bubbleSort: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.',
  },
  selectionSort: {
    name: 'Selection Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description:
      'Divides the list into sorted and unsorted regions, repeatedly selecting the smallest element from unsorted.',
  },
  heapSort: {
    name: 'Heap Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    description:
      'Builds a max heap from the array, then repeatedly extracts the maximum element.',
  },
  insertionSort: {
    name: 'Insertion Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description:
      'Builds the final sorted array one item at a time by inserting each element into its proper position.',
  },
};

const randomNumbers = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateArray = (size: number) => {
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = randomNumbers(5, 400);
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
  const [arraySize, setArraySize] = useState(50);
  const [arr, setArr] = useState(generateArray(arraySize));
  const [speed, setSpeed] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selected, setSelected] = useState<keyof typeof algorithmInfo>('mergeSort');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const arrayBars = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    setArr(generateArray(arraySize));
  }, [arraySize]);

  const resetArray = () => {
    setArr(generateArray(arraySize));
    setComparisons(0);
    setSwaps(0);
  };

  const pauseHandler = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(!isPaused);
  };

  const sleep = (ms: number) => {
    return new Promise((resolve) => {
      const checkPause = () => {
        if (!pauseRef.current) {
          setTimeout(resolve, ms);
        } else {
          setTimeout(checkPause, 100);
        }
      };
      checkPause();
    });
  };

  const animateAlgorithm = async (steps: ISteps[]) => {
    const bars = arrayBars.current!.children as any;
    let comparisonCount = 0;
    let swapCount = 0;

    for (let k = 0; k < steps.length; k++) {
      if (!isSorting) break;

      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === 'swap') {
        bars[i].style.backgroundColor = SWAP_COLOR;
        bars[j].style.backgroundColor = SWAP_COLOR;

        if (selected === 'mergeSort') {
          bars[i].style.height = `${j}px`;
          bars[i].children[0].textContent = j;
        } else {
          swapEles(bars, i, j);
        }
        swapCount++;
        setSwaps(swapCount);
      } else if (type === 'compare') {
        bars[i].style.backgroundColor = COMPARE_COLOR;
        bars[j].style.backgroundColor = COMPARE_COLOR;
        comparisonCount++;
        setComparisons(comparisonCount);
      } else if (type === 'return') {
        bars[i].style.backgroundColor = PRIMARY_COLOR;
        bars[j].style.backgroundColor = PRIMARY_COLOR;
      }

      await sleep(101 - speed);
    }

    // Mark all bars as sorted
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.backgroundColor = SORTED_COLOR;
      await sleep(10);
    }
  };

  const startSorting = async () => {
    setIsSorting(true);
    setComparisons(0);
    setSwaps(0);
    pauseRef.current = false;
    setIsPaused(false);

    const tempArr = [...arr];
    let steps: ISteps[] = [];

    switch (selected) {
      case 'mergeSort':
        steps = mergeSortSteps(tempArr);
        break;
      case 'quickSort':
        steps = quicksortSteps(tempArr);
        break;
      case 'bubbleSort':
        steps = bubbleSortSteps(tempArr);
        break;
      case 'selectionSort':
        steps = selectionSortSteps(tempArr);
        break;
      case 'heapSort':
        steps = heapSortSteps(tempArr);
        break;
      case 'insertionSort':
        steps = insertionSortSteps(tempArr);
        break;
    }

    await animateAlgorithm(steps);
    setArr(tempArr);
    setIsSorting(false);
  };

  return (
    <div className="visualizer-container">
      {/* Header */}
      <header className="header">
        <h1 className="title">
          <BiBarChartAlt2 className="logo" />
          Sorting Algorithm Visualizer
        </h1>
        <button className="info-button" onClick={() => setShowInfo(!showInfo)}>
          <FaInfoCircle />
        </button>
      </header>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="control-group">
          <label className="control-label">Array Size: {arraySize}</label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <MdSpeed className="speed-icon" />
            Speed: {speed}ms
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="button-group">
          <button
            className="control-button generate"
            onClick={resetArray}
            disabled={isSorting}
          >
            <FaRedo /> New Array
          </button>

          {!isSorting ? (
            <button className="control-button play" onClick={startSorting}>
              <FaPlay /> Start Sorting
            </button>
          ) : (
            <button className="control-button pause" onClick={pauseHandler}>
              {isPaused ? <FaPlay /> : <FaPause />}
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="algorithm-section">
        {Object.entries(algorithmInfo).map(([key, info]) => (
          <button
            key={key}
            className={`algorithm-card ${selected === key ? 'selected' : ''}`}
            onClick={() => setSelected(key as keyof typeof algorithmInfo)}
            disabled={isSorting}
          >
            <h3>{info.name}</h3>
            <p className="complexity">Time: {info.timeComplexity}</p>
          </button>
        ))}
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <h4>Comparisons</h4>
          <p className="stat-value">{comparisons}</p>
        </div>
        <div className="stat-card">
          <h4>Swaps</h4>
          <p className="stat-value">{swaps}</p>
        </div>
      </div>

      {/* Algorithm Info Modal */}
      {showInfo && selected && (
        <div className="info-modal" onClick={() => setShowInfo(false)}>
          <div className="info-content" onClick={(e) => e.stopPropagation()}>
            <h2>{algorithmInfo[selected].name}</h2>
            <p className="info-description">{algorithmInfo[selected].description}</p>
            <div className="info-complexity">
              <p>
                <strong>Time Complexity:</strong> {algorithmInfo[selected].timeComplexity}
              </p>
              <p>
                <strong>Space Complexity:</strong>{' '}
                {algorithmInfo[selected].spaceComplexity}
              </p>
            </div>
            <button className="close-button" onClick={() => setShowInfo(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Array Visualization */}
      <div className="array-container" ref={arrayBars}>
        {arr.map((number, idx) => (
          <div
            key={idx}
            className="bar"
            style={{
              height: `${number}px`,
              backgroundColor: PRIMARY_COLOR,
              width: `${100 / arraySize}%`,
            }}
          >
            {arraySize <= 30 && <span className="bar-value">{number}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
