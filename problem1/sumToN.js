// Uses the arithmetic series formula: n * (n + 1) / 2
var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};

// Uses a simple loop to accumulate the sum
var sum_to_n_b = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Uses recursion to calculate the sum
var sum_to_n_c = function (n) {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_c(n - 1);
};

// Test cases
console.log("Testing sum_to_n_a:");
console.log(sum_to_n_a(5));
console.log(sum_to_n_a(10));
console.log(sum_to_n_a(100));

console.log("\nTesting sum_to_n_b:");
console.log(sum_to_n_b(5));
console.log(sum_to_n_b(10));
console.log(sum_to_n_b(100));

console.log("\nTesting sum_to_n_c:");
console.log(sum_to_n_c(5));
console.log(sum_to_n_c(10));
console.log(sum_to_n_c(100));
