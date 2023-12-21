// Get the canvas element and its context
const canvas = document.getElementById('calculatorCanvas');
const ctx = canvas.getContext('2d');

// Event handling for calculator buttons goes here...
canvas.addEventListener('click', handleButtonClick);
document.addEventListener('keydown', handleKeyPress);

// Define the size of the calculator
const canvasWidth = 350;
const canvasHeight = 500; // Height adjusted for a better proportion
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Define color scheme based on the mockup
const colorScheme = {
    background: '#333333',
    keyBackground: '#7b787c',
    keyShadow: '#2A2A2A',
    text: '#FFFFFF',
    operationKey: '#ff9f0c',
    displayBackground: '#4e5052',
    displayText: '#FFFFFF',
    errorText: '#FF3B30'
};

// Define the button labels and positions
const buttons = [
    ['', '', '', '%', '/'],
    ['(', '7', '8', '9', 'x'],
    [')', '4', '5', '6', '-'],
    ['Back', '1', '2', '3', '+'],
    ['', '0', '', '.', '=']
];



// Initialize the display values
let currentExpression = '';
let currentResult = '';
let isError = false;

// Function to draw the calculator UI
function drawCalculator() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Define the radius for curved corners
    const cornerRadius = 15;

   // Calculate the new canvas height excluding the display area
   const displayHeight = canvasHeight * 0.2;
   const calculatorHeight = canvasHeight - displayHeight;

   // Draw the calculator background with rounded corners
   ctx.fillStyle = colorScheme.displayBackground;
   ctx.beginPath();
   ctx.moveTo(cornerRadius, 0);
   ctx.lineTo(canvasWidth - cornerRadius, 0);
   ctx.arcTo(canvasWidth, 0, canvasWidth, cornerRadius, cornerRadius);
   ctx.lineTo(canvasWidth, calculatorHeight - cornerRadius);
   ctx.arcTo(canvasWidth, calculatorHeight, canvasWidth - cornerRadius, calculatorHeight, cornerRadius);
   ctx.lineTo(cornerRadius, calculatorHeight);
   ctx.arcTo(0, calculatorHeight, 0, calculatorHeight - cornerRadius, cornerRadius);
   ctx.lineTo(0, cornerRadius);
   ctx.arcTo(0, 0, cornerRadius, 0, cornerRadius);
   ctx.fill();

   

    // Draw the Mac-like buttons (Red, Yellow, Green)
    const buttonRadius = 7;
    const buttonPadding = 14.5;

    // Red button
    ctx.fillStyle = '#FF3B30'; // Red color
    ctx.beginPath();
    ctx.arc(buttonPadding + buttonRadius, buttonPadding + buttonRadius, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Yellow button
    ctx.fillStyle = '#FFCC00'; // Yellow color
    ctx.beginPath();
    ctx.arc(2 * (buttonPadding + buttonRadius), buttonPadding + buttonRadius, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Green button
    ctx.fillStyle = '#4CD964'; // Green color
    ctx.beginPath();
    ctx.arc(3 * (buttonPadding + buttonRadius), buttonPadding + buttonRadius, buttonRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the expression and result
    ctx.fillStyle = isError ? colorScheme.errorText : colorScheme.displayText;
    ctx.font = 'bold 17px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(currentExpression || '0', canvasWidth - 12, 43);
    ctx.fillStyle = colorScheme.text;
    ctx.font = 'bold 25px Arial';
    ctx.fillText(currentResult, canvasWidth - 10, 80);

    // Calculate button dimensions
    const buttonHeight = (canvasHeight * 0.6) / buttons.length;
    const buttonWidth = canvasWidth / buttons[0].length;

    // Draw the buttons
    buttons.forEach((row, rowIndex) => {
        row.forEach((label, colIndex) => {
            // Set colors for buttons
            if (rowIndex === 0 && colIndex <= 3) {
                ctx.fillStyle = '#5e6064';
            } else {
                ctx.fillStyle = colorScheme.keyBackground;
            }

            // Operation colors
            if (['/', 'x', '-', '+', '='].includes(label)) {
                ctx.fillStyle = colorScheme.operationKey;
            }

            // Calculate button position
            const x = colIndex * buttonWidth;
            const y = canvasHeight * 0.2 + rowIndex * buttonHeight;
            const buttonRadius = 15;
            // Check if the current button is in the 5th row and 5th column
            if (rowIndex === 4 && colIndex === 4) {
                // Draw a button with curved edges 
                ctx.beginPath();
                ctx.quadraticCurveTo(x + buttonWidth, y, x + buttonWidth, y + buttonRadius); 
                ctx.lineTo(x + buttonWidth, y + buttonHeight - buttonRadius); 
                ctx.quadraticCurveTo(x + buttonWidth, y + buttonHeight, x + buttonWidth - buttonRadius, y + buttonHeight); 
                ctx.lineTo(x, y + buttonHeight); 
                ctx.lineTo(x, y); 
                ctx.quadraticCurveTo(x, y, x + buttonRadius, y); 
                ctx.fill();
            } else if (rowIndex === 4 && colIndex === 0) {
                // Draw a button with curved edges
                ctx.beginPath();
                ctx.lineTo(x + buttonWidth, y); 
                ctx.lineTo(x + buttonWidth, y + buttonHeight); 
                ctx.quadraticCurveTo(x + buttonWidth, y + buttonHeight, x + buttonWidth - buttonRadius, y + buttonHeight);
                ctx.lineTo(x + buttonRadius, y + buttonHeight);
                ctx.quadraticCurveTo(x, y + buttonHeight, x, y + buttonHeight - buttonRadius);
                ctx.lineTo(x, y);
                ctx.quadraticCurveTo(x, y, x + buttonRadius, y);
                ctx.fill();
            } else {
                // Draw a standard rectangular button for other buttons
                ctx.fillRect(x, y, buttonWidth, buttonHeight);
            }

            // Draw button text (if not blank)
            if (label) {
                ctx.fillStyle = colorScheme.text;
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(label, x + buttonWidth / 2, y + buttonHeight / 2);
            }
        });
    });

    // Draw lines to separate buttons (vertical and horizontal)
    ctx.fillStyle = colorScheme.displayBackground;
    ctx.lineWidth = 0.5;

    // Calculate the height for vertical lines
    const verticalLineHeight = canvasHeight - (canvasHeight * 0.2);

    // Vertical lines
    for (let col = 1; col < buttons[0].length; col++) {
        const x = col * buttonWidth;
        if (col !== 2 && col !== 1) {
            ctx.beginPath();
            ctx.moveTo(x, canvasHeight * 0.2);
            ctx.lineTo(x, verticalLineHeight);
            ctx.stroke();
        }
        if (col === 1 || col === 2) {
            ctx.beginPath();
            ctx.moveTo(x, canvasHeight * 0.2);
            ctx.lineTo(x, verticalLineHeight - buttonHeight);
            ctx.stroke();
        }
    }

    // Horizontal lines
    for (let row = 1; row < buttons.length; row++) {
        const y = canvasHeight * 0.2 + row * buttonHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
    }
}

// Call the draw function to render the calculator
drawCalculator();

// Event handling for calculator buttons goes here...
canvas.addEventListener('click', handleButtonClick);

function handleButtonClick(event) {
    // Calculate the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the button dimensions
    const buttonHeight = (canvasHeight * 0.6) / buttons.length;
    const buttonWidth = canvasWidth / buttons[0].length;

    // Determine which button was clicked
    const clickedRow = Math.floor((mouseY - (canvasHeight * 0.2)) / buttonHeight);
    const clickedCol = Math.floor(mouseX / buttonWidth);
    const clickedLabel = buttons[clickedRow][clickedCol];

    // Handle the button click based on its label
    if (clickedLabel) {
        // Perform the corresponding action
        if (clickedLabel === '=') {
            // Perform the calculation
            performCalculation();
        } else if (clickedLabel === 'Back') {
            // Handle backspace functionality
            handleBackspace();
        } else {
            // Append the button label to the current expression
            currentExpression += clickedLabel;
            drawCalculator(); // Redraw the calculator with the updated expression
        }
    }
}

function handleKeyPress(event) {
    const keyPressed = event.key;

    // Handle numeric and operator keys
    if (/[\d+\-*/().%=]|Enter/.test(keyPressed)) {
        if (keyPressed === 'Enter') {
            performCalculation();
        }
        if(keyPressed!=='Enter'){
        currentExpression += keyPressed;
        }
        drawCalculator();
    } else if (keyPressed === 'Backspace') {
        // Handle backspace key
        handleBackspace();
    } else if (keyPressed === 'Escape') {
        // Handle ESC key to clear the expression
        currentExpression = '';
        currentResult = '';
        drawCalculator();
    }
}

function handleBackspace() {
    // Implement the backspace functionality to remove the last character from currentExpression
    currentExpression = currentExpression.slice(0, -1);
    drawCalculator(); // Redraw the calculator with the updated expression
}

// Function to evaluate an expression
function evaluateExpression(expression) {
    expression = expression.replace(/x/g, '*');

    function operate(operators, values) {
        let operator = operators.pop();
        let right = values.pop();
        let left = values.pop();

        if (operator === '+') {
            values.push(left + right);
        } else if (operator === '-') {
            values.push(left - right);
        } else if (operator === '*') {
            values.push(left * right);
        } else if (operator === '/') {
            if (right !== 0) {
                values.push(left / right);
            } else {
                throw new Error('Division by zero');
            }
        } else if (operator === '%') {
            if (right !== 0) {
                values.push(left % right);
            } else {
                throw new Error('Modulo by zero');
            }
        }
    }

    function precedence(operator) {
        if (operator === '+' || operator === '-') {
            return 1;
        } else if (operator === '*' || operator === '/' || operator === '%') {
            return 2;
        }
        return 0;
    }

    let tokens = expression.match(/\d+|\+|\-|\*|\/|\%|\(|\)/g);

    let values = [];
    let operators = [];

    for (let token of tokens) {
        if (token.match(/\d+/)) {
            values.push(parseFloat(token));
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                operate(operators, values);
            }
            operators.pop(); // Pop the opening parenthesis
        } else {
            while (
                operators.length > 0 &&
                precedence(operators[operators.length - 1]) >= precedence(token)
            ) {
                operate(operators, values);
            }
            operators.push(token);
        }
    }

    while (operators.length > 0) {
        operate(operators, values);
    }

    if (values.length === 1) {
        return values[0];
    } else {
        throw new Error('Invalid expression');
    }
}

// Function to perform calculation and update the result
function performCalculation() {
    // Use the evaluateExpression function
    const result = evaluateExpression(currentExpression);

    if (!isNaN(result)) {
        currentResult = result.toString();
        isError = false;
    } else {
        currentResult = 'Invalid Expression';
        isError = true;
    }
    drawCalculator();
}


