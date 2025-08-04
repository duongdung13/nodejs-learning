// 1. Optional Chaining (?.)
// const user = {
//     profile: {
//       name: "Alice",
//     }
//   };
  
//   console.log(user.profile?.name); // Alice
//   console.log(user.settings?.theme); // undefined (không lỗi)



  //2. Nullish Coalescing (??)
//   const input = 0;

// const value1 = input || 100;     // 100 ❌ (0 là falsy)
// const value2 = input ?? 100;     // 0 ✅ (vì input không phải null/undefined)

// console.log(value1); // 100
// console.log(value2); // 0



// 3. Destructuring
const user = { name: "Bob", age: 25 };
const { name, age } = user;
console.log(name); // Bob

const nums = [10, 20, 30];
const [a, b] = nums;
console.log(a); // 10
console.log(b); // 10