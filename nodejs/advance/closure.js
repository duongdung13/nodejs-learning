// function createCounter() {
//     let count = 0;
  
//     return function() {
//       count++;
//       console.log(`Count: ${count}`);
//     };
//   }
  
//   const counter1 = createCounter();
//   counter1(); // Count: 1
//   counter1(); // Count: 2
  
//   const counter2 = createCounter();
//   counter2(); // Count: 1 (tách biệt với counter1)




function sayHello(name) {
    return function() {
      console.log(`Hello, ${name}`);
    };
  }
  
  const greetDung = sayHello("Dung");
  greetDung(); // Hello, Dung