let playButton, pauseButton, stepButton, resetButton;

let array = [];
let arraySize = 10;
let barWidth;

let i = 0;
let j = 0;
let sorting = false;

function setup() {
  createCanvas(600, 400);
  barWidth = width / arraySize;
  generateArray();
  frameRate(5); // 5 steps per second

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
}

function generateArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(random(height));
  }
}

function draw() {
  background(220);
  if (sorting) {
    bubbleSortStep();
  }
  for (let k = 0; k < array.length; k++) {
    // Color sorted elements green
    if (k >= array.length - i) {
      fill(0, 255, 0);
    } else {
      fill(255);
    }

    // Highlight current comparison in red
    if (sorting && k === j) {
      fill(255, 0, 0);
    } else if (!sorting && k === j) {
      fill(0, 0, 255);
    }
    rect(k * barWidth, height - array[k], barWidth - 2, array[k]);
  }
}

function bubbleSortStep() {
  if (i < array.length) {
    if (j < array.length - i - 1) {
      if (array[j] > array[j + 1]) {
        // swap elements
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
      j++;
    } else {
      j = 0;
      i++;
    }
  } else {
    sorting = false;
  }
}

function startSorting() {
  sorting = true;
}

function pauseSorting() {
  sorting = false;
}

function stepSorting() {
  bubbleSortStep();
}

function resetSorting() {
  generateArray();
  i = 0;
  j = 0;
  sorting = false;
}
