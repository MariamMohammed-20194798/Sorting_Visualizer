import React, { FC, useState, useRef } from 'react';
import './sortingVisualizer.css';
import { mergeSortSteps } from '../Algorithms/mergeSort';
import { quicksortSteps } from '../Algorithms/quickSort';
import { bubbleSortSteps } from '../Algorithms/bubbleSort';
import { selectionSortSteps } from '../Algorithms/selectionSort';
import { heapSortSteps } from '../Algorithms/heapSort';
import { insertionSortSteps } from '../Algorithms/insertionSort';
import { ISteps } from './../Interface/steps';

export interface VisualizerProps {}

const PRIMARY_COLOR = '#6366f1';
const FIRST_COLOR = '#ef4444';
const SECOND_COLOR = '#10b981';
const PIVOT_COLOR = '#f59e0b';

const randomNumbers = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateArray = (size: number = 35) => {
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    array[i] = randomNumbers(10, 400);
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
  const [arraySize, setArraySize] = useState(35);
  const [arr, setArr] = useState(generateArray(35));
  const [speed, setSpeed] = useState(30);
  const [isSorted, setIsSorted] = useState(false);
  const [selected, setSelected] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [currentAlgorithmInfo, setCurrentAlgorithmInfo] = useState<any>(null);
  const arrayBars = useRef<HTMLDivElement>(null);

  const algorithmInfo = {
    mergeSort: {
      name: 'Merge Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      description:
        'Divide-and-conquer algorithm that divides the array into smaller subarrays, sorts them, and then merges them back together.',
    },
    quickSort: {
      name: 'Quick Sort',
      timeComplexity: 'O(n log n) avg, O(n²) worst',
      spaceComplexity: 'O(log n)',
      description:
        'Efficient divide-and-conquer algorithm that partitions the array around a pivot element.',
    },
    heapSort: {
      name: 'Heap Sort',
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(1)',
      description:
        'Comparison-based algorithm that uses a binary heap data structure to sort elements by building a max heap and repeatedly extracting the maximum.',
    },
    insertionSort: {
      name: 'Insertion Sort',
      timeComplexity: 'O(n²) worst, O(n) best',
      spaceComplexity: 'O(1)',
      description:
        'Simple and efficient algorithm for small datasets that builds the sorted array one element at a time by inserting each element into its correct position.',
    },
    bubbleSort: {
      name: 'Bubble Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description:
        'Simple comparison-based algorithm that repeatedly swaps adjacent elements if they are in the wrong order.',
    },
    selectionSort: {
      name: 'Selection Sort',
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      description:
        'Algorithm that repeatedly finds the minimum element and places it at the beginning of the array.',
    },
  };

  const resetBarColors = () => {
    const bars = arrayBars.current?.children as any;
    if (bars) {
      for (let i = 0; i < bars.length; i++) {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`;
        bars[i].classList.remove('bar-comparing', 'bar-swapping');
      }
    }
  };

  const arrayHandler = () => {
    setArr(generateArray(arraySize));
    setComparisons(0);
    setSwaps(0);
    setSelected('');
    // Reset colors after a short delay to ensure DOM is updated
    setTimeout(resetBarColors, 100);
  };

  const arraySizeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(5, Math.min(100, +e.target.value));
    setArraySize(newSize);
    setArr(generateArray(newSize));
    setComparisons(0);
    setSwaps(0);
    setSelected('');
    // Reset colors after a short delay to ensure DOM is updated
    setTimeout(resetBarColors, 100);
  };

  const speedHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Math.max(1, +e.target.value));
  };
  const showAlgorithmInfo = (algorithm: string) => {
    setCurrentAlgorithmInfo(algorithmInfo[algorithm as keyof typeof algorithmInfo]);
    setShowInfo(true);
  };

  // ######################################################################
  const mergeSortHandler = async (algorithm: string) => {
    setIsSorted(true);
    setSelected(algorithm);
    setComparisons(0);
    setSwaps(0);
    const tempArr = [...arr];
    const steps: ISteps[] = mergeSortSteps(tempArr);
    const bars = arrayBars.current!.children as any;

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === 'swap') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${SECOND_COLOR} 0%, ${SECOND_COLOR}dd 100%)`;
        bars[i].style.height = `${j}px`;
        bars[i].children[0] && (bars[i].children[0].textContent = j);
        bars[i].classList.add('bar-swapping');
        setSwaps((prev) => prev + 1);

        // Remove animation class after animation completes
        setTimeout(() => {
          bars[i].classList.remove('bar-swapping');
        }, 400);
      } else if (type === 'compare') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${FIRST_COLOR} 0%, ${FIRST_COLOR}dd 100%)`;
        bars[
          j
        ].style.background = `linear-gradient(180deg, ${FIRST_COLOR} 0%, ${FIRST_COLOR}dd 100%)`;
        bars[i].classList.add('bar-comparing');
        bars[j].classList.add('bar-comparing');
        setComparisons((prev) => prev + 1);

        // Remove animation class after animation completes
        setTimeout(() => {
          bars[i].classList.remove('bar-comparing');
          bars[j].classList.remove('bar-comparing');
        }, 600);
      } else if (type === 'return') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`;
        bars[
          j
        ].style.background = `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`;
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
    setComparisons(0);
    setSwaps(0);
    const tempArr = [...arr];
    let steps: ISteps[] = [];
    const bars = arrayBars.current!.children as any;

    if (algorithm === 'quickSort') steps = quicksortSteps(tempArr);
    else if (algorithm === 'bubbleSort') steps = bubbleSortSteps(tempArr);
    else if (algorithm === 'selectionSort') steps = selectionSortSteps(tempArr);
    else if (algorithm === 'heapSort') steps = heapSortSteps(tempArr);
    else if (algorithm === 'insertionSort') steps = insertionSortSteps(tempArr);

    for (let k = 0; k < steps.length; k++) {
      const {
        type,
        indexes: [i, j],
      } = steps[k];

      if (type === 'swap') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${SECOND_COLOR} 0%, ${SECOND_COLOR}dd 100%)`;
        bars[
          j
        ].style.background = `linear-gradient(180deg, ${SECOND_COLOR} 0%, ${SECOND_COLOR}dd 100%)`;
        bars[i].classList.add('bar-swapping');
        bars[j].classList.add('bar-swapping');
        swapEles(bars, i, j);
        setSwaps((prev) => prev + 1);

        // Remove animation class after animation completes
        setTimeout(() => {
          bars[i].classList.remove('bar-swapping');
          bars[j].classList.remove('bar-swapping');
        }, 400);
      } else if (type === 'compare') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${FIRST_COLOR} 0%, ${FIRST_COLOR}dd 100%)`;
        bars[
          j
        ].style.background = `linear-gradient(180deg, ${FIRST_COLOR} 0%, ${FIRST_COLOR}dd 100%)`;
        bars[i].classList.add('bar-comparing');
        bars[j].classList.add('bar-comparing');
        setComparisons((prev) => prev + 1);

        // Remove animation class after animation completes
        setTimeout(() => {
          bars[i].classList.remove('bar-comparing');
          bars[j].classList.remove('bar-comparing');
        }, 600);
      } else if (type === 'return') {
        bars[
          i
        ].style.background = `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`;
        bars[
          j
        ].style.background = `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`;
      }
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setArr(tempArr);
    setIsSorted(false);
  };
  // ########################################################################

  return (
    <div className="visualizer-container">
      {/* Header */}
      <div className="header">
        <div className="title">
          <span className="logo">📊</span>
          Sorting Algorithm Visualizer
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="control-group">
          <label className="control-label">
            <span className="speed-icon">📊</span>
            Array Size: {arraySize}
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={arraySizeHandler}
            disabled={isSorted}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <span className="speed-icon">⚡</span>
            Animation Speed: {speed}ms
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={speedHandler}
            disabled={isSorted}
            className="slider"
          />
        </div>

        <div className="button-group">
          <button
            className="control-button generate"
            onClick={arrayHandler}
            disabled={isSorted}
          >
            🔄 Generate New Array
          </button>
        </div>

        <div className="control-group">
          <label className="control-label">🎯 Quick Size Selection</label>
          <div className="preset-buttons">
            <button
              className={`preset-btn ${arraySize === 10 ? 'active' : ''}`}
              onClick={() =>
                !isSorted && arraySizeHandler({ target: { value: '10' } } as any)
              }
              disabled={isSorted}
            >
              Small (10)
            </button>
            <button
              className={`preset-btn ${arraySize === 35 ? 'active' : ''}`}
              onClick={() =>
                !isSorted && arraySizeHandler({ target: { value: '35' } } as any)
              }
              disabled={isSorted}
            >
              Medium (35)
            </button>
            <button
              className={`preset-btn ${arraySize === 70 ? 'active' : ''}`}
              onClick={() =>
                !isSorted && arraySizeHandler({ target: { value: '70' } } as any)
              }
              disabled={isSorted}
            >
              Large (70)
            </button>
            <button
              className={`preset-btn ${arraySize === 100 ? 'active' : ''}`}
              onClick={() =>
                !isSorted && arraySizeHandler({ target: { value: '100' } } as any)
              }
              disabled={isSorted}
            >
              XL (100)
            </button>
          </div>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div className="algorithm-section">
        <div
          className={`algorithm-card ${selected === 'mergeSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && mergeSortHandler('mergeSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Merge Sort</h3>
          <div className="complexity">O(n log n)</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('mergeSort');
            }}
          >
            ℹ️
          </button>
        </div>

        <div
          className={`algorithm-card ${selected === 'quickSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && sortingAlgorithmHandler('quickSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Quick Sort</h3>
          <div className="complexity">O(n log n) avg</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('quickSort');
            }}
          >
            ℹ️
          </button>
        </div>

        <div
          className={`algorithm-card ${selected === 'bubbleSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && sortingAlgorithmHandler('bubbleSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Bubble Sort</h3>
          <div className="complexity">O(n²)</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('bubbleSort');
            }}
          >
            ℹ️
          </button>
        </div>

        <div
          className={`algorithm-card ${selected === 'selectionSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && sortingAlgorithmHandler('selectionSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Selection Sort</h3>
          <div className="complexity">O(n²)</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('selectionSort');
            }}
          >
            ℹ️
          </button>
        </div>

        <div
          className={`algorithm-card ${selected === 'heapSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && sortingAlgorithmHandler('heapSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Heap Sort</h3>
          <div className="complexity">O(n log n)</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('heapSort');
            }}
          >
            ℹ️
          </button>
        </div>

        <div
          className={`algorithm-card ${selected === 'insertionSort' ? 'selected' : ''}`}
          onClick={() => !isSorted && sortingAlgorithmHandler('insertionSort')}
          style={{
            cursor: isSorted ? 'not-allowed' : 'pointer',
            opacity: isSorted ? 0.5 : 1,
          }}
        >
          <h3>Insertion Sort</h3>
          <div className="complexity">O(n²) / O(n)</div>
          <button
            className="info-button"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem' }}
            onClick={(e) => {
              e.stopPropagation();
              showAlgorithmInfo('insertionSort');
            }}
          >
            ℹ️
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <h4>Array Size</h4>
          <div className="stat-value">{arr.length}</div>
        </div>
        <div className="stat-card">
          <h4>Comparisons</h4>
          <div className="stat-value">{comparisons}</div>
        </div>
        <div className="stat-card">
          <h4>Swaps</h4>
          <div className="stat-value">{swaps}</div>
        </div>
      </div>

      {/* Array Container */}
      <div className="array-container" ref={arrayBars}>
        {arr.map((number, idx) => {
          const barWidth = Math.max(Math.min(1000 / arraySize - 2, 50), 4);
          const showValue = arraySize <= 50; // Only show values for smaller arrays

          return (
            <div
              key={idx}
              className="bar enhanced-bar"
              style={{
                height: `${number}px`,
                width: `${barWidth}px`,
                background: `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}dd 100%)`,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: arraySize <= 30 ? '4px 4px 0 0' : '2px 2px 0 0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0)',
                position: 'relative',
                margin: '0 1px',
              }}
            >
              {showValue && (
                <div
                  className="bar-value"
                  style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: arraySize <= 20 ? '0.75rem' : '0.6rem',
                    color: '#94a3b8',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {number}
                </div>
              )}

              {/* Highlight effect on top */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '3px',
                  background:
                    'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                  borderRadius: '2px 2px 0 0',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Info Modal */}
      {showInfo && currentAlgorithmInfo && (
        <div className="info-modal" onClick={() => setShowInfo(false)}>
          <div className="info-content" onClick={(e) => e.stopPropagation()}>
            <h2>{currentAlgorithmInfo.name}</h2>
            <p className="info-description">{currentAlgorithmInfo.description}</p>
            <div className="info-complexity">
              <p>
                <strong>Time Complexity:</strong> {currentAlgorithmInfo.timeComplexity}
              </p>
              <p>
                <strong>Space Complexity:</strong> {currentAlgorithmInfo.spaceComplexity}
              </p>
            </div>
            <button className="close-button" onClick={() => setShowInfo(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
