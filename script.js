function allocateMemory() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const numBlocks = parseInt(document.getElementById('numBlocks').value);
    const blockSizesInput = document.getElementById('blockSizes').value;
    const processSizesInput = document.getElementById('processSizes').value;

    if (isNaN(numProcesses) || isNaN(numBlocks) || numProcesses <= 0 || numBlocks <= 0) {
        document.getElementById('memoryDisplay').innerHTML = 'Please enter valid numbers for processes and blocks.';
        return;
    }

    const blockSizes = blockSizesInput.split(',').map(size => parseInt(size));
    const processSizes = processSizesInput.split(',').map(size => parseInt(size));

    if (blockSizes.length !== numBlocks || processSizes.length !== numProcesses) {
        document.getElementById('memoryDisplay').innerHTML = 'Please enter valid sizes for blocks and processes.';
        return;
    }

    // Clear previous memory allocation display
    document.getElementById('memoryDisplay').innerHTML = '';

    // Display memory blocks
    displayMemoryBlocks(blockSizes);

    // Allocate processes to memory blocks using different algorithms
    allocateFirstFit(blockSizes, processSizes);
    allocateBestFit(blockSizes, processSizes);
    allocateWorstFit(blockSizes, processSizes);
}

function displayMemoryBlocks(blockSizes) {
    const memoryDisplay = document.getElementById('memoryDisplay');
    let memoryBlocksHTML = '';

    memoryBlocksHTML += '<div>';
    blockSizes.forEach(size => {
        memoryBlocksHTML += `<div class="memory-block">${size}KB</div>`;
    });
    memoryBlocksHTML += '</div>';

    memoryDisplay.innerHTML += memoryBlocksHTML;
}

function allocateFirstFit(blockSizes, processSizes) {
    const memoryDisplay = document.getElementById('memoryDisplay');
    let memoryBlocksHTML = '';
    let processesHTML = '';

    let allocation = Array(processSizes.length).fill(-1);
    let occupied = Array(blockSizes.length).fill(false);

    processSizes.forEach((processSize, processIndex) => {
        let indexPlaced = -1;

        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSize && !occupied[j]) {
                indexPlaced = j;
                break;
            }
        }

        if (indexPlaced !== -1) {
            allocation[processIndex] = indexPlaced;
            occupied[indexPlaced] = true;
            blockSizes[indexPlaced] -= processSize; // Reduce block size
        }
    });

    // memoryBlocksHTML += '<br>';
    // memoryBlocksHTML += '<h3>Memory Blocks:</h3>';
    // blockSizes.forEach((blockSize, blockIndex) => {
    //     const occupiedSize = blockSize - (blockSize - processSizes.filter((size, index) => allocation[index] === blockIndex).reduce((acc, curr) => acc + curr, 0));
    //     memoryBlocksHTML += `<div class="memory-block" style="background-color: rgba(0,255,0,0.5)">Block ${blockIndex + 1}: Occupied ${occupiedSize}KB, Remaining ${blockSizes[blockIndex] - occupiedSize}KB</div>`;
    // });

    processesHTML += '<br>';
    processesHTML += '<h3>First Fit:</h3>';
    allocation.forEach((blockIndex, processIndex) => {
        if (blockIndex !== -1) {
            processesHTML += `<div class="process" style="background-color: rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)">Process ${processIndex + 1}: ${processSizes[processIndex]}KB allocated to Block ${blockIndex + 1}</div>`;
        } else {
            processesHTML += `<div class="process" style="background-color: rgba(255,0,0,0.5)">Process ${processIndex + 1}: ${processSizes[processIndex]}KB (Not Allocated)</div>`;
        }
    });

    memoryDisplay.innerHTML += memoryBlocksHTML;
    memoryDisplay.innerHTML += processesHTML;
}

function allocateBestFit(blockSizes, processSizes) {
    const memoryDisplay = document.getElementById('memoryDisplay');
    let memoryBlocksHTML = '';
    let processesHTML = '';

    let allocation = Array(processSizes.length).fill(-1);
    let occupied = Array(blockSizes.length).fill(false);

    processSizes.forEach((processSize, processIndex) => {
        let indexPlaced = -1;

        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSize && !occupied[j]) {
                if (indexPlaced === -1 || blockSizes[j] < blockSizes[indexPlaced]) {
                    indexPlaced = j;
                }
            }
        }

        if (indexPlaced !== -1) {
            allocation[processIndex] = indexPlaced;
            occupied[indexPlaced] = true;
            blockSizes[indexPlaced] -= processSize; // Reduce block size
        }
    });

    memoryBlocksHTML += '<br>';
    memoryBlocksHTML += '<h3 style="color: #fff;">Memory Blocks:Best fit</h3>';
    blockSizes.forEach((blockSize, blockIndex) => {
        const occupiedSize = blockSize - (blockSizes[blockIndex] - processSizes.filter((size, index) => allocation[index] === blockIndex).reduce((acc, curr) => acc + curr, 0));
        const remainingSize = blockSize - occupiedSize;
        memoryBlocksHTML += `<div class="memory-block" style="background-color: rgba(0, 255, 0, 0.5); padding: 5px; margin-bottom: 5px;">Block ${blockIndex + 1}: Occupied ${occupiedSize}KB, Remaining ${remainingSize}KB</div>`;
    });

    processesHTML += '<br>';
    processesHTML += '<h3 style="color: #fff;">Best Fit:</h3>';
    allocation.forEach((blockIndex, processIndex) => {
        if (blockIndex !== -1) {
            processesHTML += `<div class="process" style="background-color: rgba(0, 0, 255, 0.5); padding: 5px; margin-bottom: 5px;">Process ${processIndex + 1}: ${processSizes[processIndex]}KB allocated to Block ${blockIndex + 1}</div>`;
        } else {
            processesHTML += `<div class="process" style="background-color: rgba(255, 0, 0, 0.5); padding: 5px; margin-bottom: 5px;">Process ${processIndex + 1}: ${processSizes[processIndex]}KB (Not Allocated)</div>`;
        }
    });

    memoryDisplay.innerHTML += memoryBlocksHTML;
    memoryDisplay.innerHTML += processesHTML;
}






function allocateWorstFit(blockSizes, processSizes) {
    const memoryDisplay = document.getElementById('memoryDisplay');
    let memoryAndProcessesHTML = '';

    let allocation = Array(processSizes.length).fill(-1);
    let occupied = Array(blockSizes.length).fill(false);

    processSizes.forEach((processSize, processIndex) => {
        let indexPlaced = -1;
        let maxRemainingSize = -1;

        for (let j = 0; j < blockSizes.length; j++) {
            if (blockSizes[j] >= processSize && !occupied[j]) {
                const remainingSize = blockSizes[j] - processSize;
                if (remainingSize > maxRemainingSize) {
                    maxRemainingSize = remainingSize;
                    indexPlaced = j;
                }
            }
        }

        if (indexPlaced !== -1) {
            allocation[processIndex] = indexPlaced;
            occupied[indexPlaced] = true;
            blockSizes[indexPlaced] -= processSize; // Reduce block size
        }
    });

    memoryAndProcessesHTML += '<br>';
    memoryAndProcessesHTML += '<h3>Memory Blocks and Process Allocations (Worst Fit):</h3>';
    blockSizes.forEach((blockSize, blockIndex) => {
        const remainingSize = blockSize - (blockSizes[blockIndex] - processSizes.filter((size, index) => allocation[index] === blockIndex).reduce((acc, curr) => acc + curr, 0));
        const occupiedSize = blockSize - remainingSize;
        memoryAndProcessesHTML += `<div class="memory-block" style="background-color: rgba(0,255,0,0.5)">Block ${blockIndex + 1}: Occupied ${occupiedSize}KB, Remaining ${remainingSize}KB`;
        processSizes.forEach((processSize, processIndex) => {
            if (allocation[processIndex] === blockIndex) {
                memoryAndProcessesHTML += `, Process ${processIndex + 1}: ${processSize}KB`;
            }
        });
        memoryAndProcessesHTML += '</div>';
    });

    memoryDisplay.innerHTML += memoryAndProcessesHTML;
}





function allocateProcesses(blockSizes, processSizes, algorithmName, fitFunction) {
    const memoryDisplay = document.getElementById('memoryDisplay');
    let processesHTML = '';

    let allocatedBlocks = new Set();

    processSizes.forEach((processSize, index) => {
        let allocated = false;
        for (let i = 0; i < blockSizes.length; i++) {
            if (!allocatedBlocks.has(i) && fitFunction(blockSizes[i], processSize)) {
                allocatedBlocks.add(i);
                processesHTML += `<div class="process" style="background-color: rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)">Process ${index + 1}: ${processSize}KB allocated to Block ${i + 1} (${algorithmName})</div>`;
                allocated = true;
                break;
            }
        }
        if (!allocated) {
            processesHTML += `<div class="process" style="background-color: rgba(255,0,0,0.5)">Process ${index + 1}: ${processSize}KB (Not Allocated) (${algorithmName})</div>`;
        }
    });

    memoryDisplay.innerHTML += '<br>';
    memoryDisplay.innerHTML += processesHTML;
}
