function divide(a, b) {
    try {
      if (b === 0) throw new Error("Không thể chia cho 0!");
      return a / b;
    } catch (err) {
      //console.error("Lỗi:", err.message);
    }
  }
  
  console.log(divide(10, 2)); // ✅ 5
  console.log(divide(10, 0)); // ❌ Lỗi: Không thể chia cho 0!