let playButton, pauseButton, stepButton, resetButton;

let array = [];
let arraySize = 100;
let barWidth;
let currentAlgorithm = "bubble"; // default to bubble sort
let state = {
  bubble: { i: 0, j: 0, active: false },
  quick: {
    start: 0,
    end: arraySize - 1,
    i: -1,
    j: 0,
    pivot: 0,
    active: false,
    stack: [],
    sortedIndices: [],
  },
};

function setup() {
  createCanvas(600, 400);
  barWidth = width / arraySize;
  generateArray();
  frameRate(60); // 5 steps per second

  playButton = createButton("Play");
  playButton.position(10, 10);
  playButton.mousePressed(startSorting);

  pauseButton = createButton("Pause");
  pauseButton.position(70, 10);
  pauseButton.mousePressed(pauseSorting);

  stepButton = createButton("Step");
  stepButton.position(130, 10);
  stepButton.mousePressed(stepSorting);

  resetButton = createButton("Reset");
  resetButton.position(190, 10);
  resetButton.mousePressed(resetSorting);

  // Dropdown
  algorithmSelect = createSelect();
  algorithmSelect.position(250, 10);
  algorithmSelect.option("Bubble Sort", "bubble");
  algorithmSelect.option("Quick Sort", "quick");
  algorithmSelect.changed(updateAlgorithm);
}

function updateAlgorithm() {
  currentAlgorithm = algorithmSelect.value();
  resetSorting();
}

function generateArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(random(height));
  }
}

function draw() {
  background(220);
  if (state[currentAlgorithm].active) {
    switch (currentAlgorithm) {
      case "bubble":
        bubbleSortStep();
        break;
      case "quick":
        quickSortStep();
        break;
      default:
        console.log("No step function for:", currentAlgorithm);
        break;
    }
  }

  for (let k = 0; k < array.length; k++) {
    // default to white (unsorted)
    fill(255);

    switch (currentAlgorithm) {
      case "bubble":
        if (k >= array.length - state.bubble.i) {
          fill(0, 255, 0); // green for sorted
        } else if (state.bubble.active && k === state.bubble.j) {
          fill(255, 0, 0); // red for active comparison
        } else if (!state.bubble.active && k === state.bubble.j) {
          fill(0, 0, 255); // blue for paused comparison
        }
        break;

      case "quick":
        if (state.quick.sortedIndices.includes(k)) {
          fill(0, 255, 0);
        } else if (k === state.quick.j) {
          fill(255, 0, 0);
        } else if (k === state.quick.end) {
          fill(255, 255, 0);
        } else if (!state.quick.active && state.quick.stack.length === 0) {
          fill(200);
        }
        break;

      default:
        console.log("Unknown algorithm:", currentAlgorithm);
        break;
    }

    rect(k * barWidth, height - array[k], barWidth - 2, array[k]);
  }
}

function bubbleSortStep() {
  if (state.bubble.i < array.length) {
    if (state.bubble.j < array.length - state.bubble.i - 1) {
      if (array[state.bubble.j] > array[state.bubble.j + 1]) {
        // swap elements
        let temp = array[state.bubble.j];
        array[state.bubble.j] = array[state.bubble.j + 1];
        array[state.bubble.j + 1] = temp;
      }
      state.bubble.j++;
    } else {
      state.bubble.j = 0;
      state.bubble.i++;
    }
  } else {
    state.bubble.active = false;
  }
}

function quickSortStep() {
  if (state.quick.j === state.quick.start && state.quick.i === -1) {
    if (state.quick.start >= state.quick.end) {
      if (state.quick.start === state.quick.end) {
        state.quick.sortedIndices.push(state.quick.start); // Single-element pivot
      }
      if (state.quick.stack.length > 0) {
        let next = state.quick.stack.pop();
        state.quick.start = next.start;
        state.quick.end = next.end;
        state.quick.i = -1;
        state.quick.j = next.start;
      } else {
        console.log("Sorted indices (pivots):", state.quick.sortedIndices);
        state.quick.active = false;
      }
      return;
    }
    state.quick.pivot = array[state.quick.end];
    state.quick.i = state.quick.start - 1;
  }

  if (state.quick.j < state.quick.end) {
    if (array[state.quick.j] <= state.quick.pivot) {
      state.quick.i++;
      let temp = array[state.quick.i];
      array[state.quick.i] = array[state.quick.j];
      array[state.quick.j] = temp;
    }
    state.quick.j++;
  } else {
    state.quick.i++;
    if (state.quick.i !== state.quick.end) {
      let temp = array[state.quick.end];
      array[state.quick.end] = array[state.quick.i];
      array[state.quick.i] = temp;
    }
    let pivotIndex = state.quick.i;
    state.quick.sortedIndices.push(pivotIndex);

    if (pivotIndex + 1 <= state.quick.end) {
      state.quick.stack.push({ start: pivotIndex + 1, end: state.quick.end });
    }
    if (state.quick.start < pivotIndex - 1) {
      state.quick.stack.push({ start: state.quick.start, end: pivotIndex - 1 });
    }

    if (state.quick.stack.length > 0) {
      let next = state.quick.stack.pop();
      state.quick.start = next.start;
      state.quick.end = next.end;
      state.quick.i = -1;
      state.quick.j = next.start;
    } else {
      console.log("Sorted indices (pivots):", state.quick.sortedIndices);
      state.quick.active = false;
    }
  }
}

function startSorting() {
  state[currentAlgorithm].active = true;
}

function pauseSorting() {
  state[currentAlgorithm].active = false;
}

function stepSorting() {
  switch (currentAlgorithm) {
    case "bubble":
      bubbleSortStep();
      break;
    case "quick":
      quickSortStep();
      break;
    default:
      console.log("Unknown algorithm:", currentAlgorithm);
      break;
  }
}

function resetSorting() {
  generateArray();
  state.bubble = { i: 0, j: 0, active: false };
  state.quick = {
    start: 0,
    end: arraySize - 1,
    i: -1,
    j: 0,
    pivot: 0,
    active: false,
    stack: [],
    sortedIndices: [],
  };
}
