// function test() {
//     var a = 1;
//     if (true) {
//       let b = 2;
//       const c = 3;
//     }
//     console.log(a); // ✅
//     console.log(b); // ❌
//     console.log(c); // ❌
//   }

//   test();



// let a = "global";

// function test() {
//   let a = "local";
//   console.log(a); // local
// }

// test();
// console.log(a); // global



function foo() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (vẫn truy cập được!)
}
foo();