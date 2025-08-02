function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

// cách 1
// exports.add = add;
// exports.subtract = subtract;

// cách 2
module.exports = { add, subtract };



