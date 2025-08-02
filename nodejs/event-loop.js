//example 1
// function a() {
//     console.log('A');
//   }
//   function b() {
//     a();
//     console.log('B');
//   }
//   b();




//example 2
// console.log('Start');

// setTimeout(() => {
//   console.log('Inside setTimeout');
// }, 0);

// console.log('End');



//example 3
// console.log('1');

// setTimeout(() => {
//   console.log('2');
// }, 0);

// Promise.resolve().then(() => {
//   console.log('3');
// });

// console.log('4');


//example 4
// console.log('Start');

// setTimeout(() => {
//   console.log('Timeout 1');

//   setTimeout(() => {
//     console.log('Timeout 2');
//   }, 0);

// }, 0);

// console.log('End');



//example 5
// console.log('Start');

// process.nextTick(() => {
//   console.log('Next Tick');
// });

// Promise.resolve().then(() => {
//   console.log('Promise then');
// });

// console.log('End');



//example 6
// async function foo() {
//     console.log('Foo start');
//     await Promise.resolve();
//     console.log('Foo end');
//   }
  
//   console.log('Script start');
//   foo();
//   console.log('Script end');



  //example 7
  console.log('Start'); // 1

  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  
  async function asyncFunc() {
    console.log('Async start'); // 2
    await null;
    console.log('Async end');
  }
  asyncFunc();
  
  Promise.resolve().then(() => {
    console.log('Promise then');
  });
  
  console.log('End');

 // Start -> Async start -> End -> Async end -> Promise then  -> setTimeout

