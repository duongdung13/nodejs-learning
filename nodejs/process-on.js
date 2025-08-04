process.on('uncaughtException', (err) => {
    console.error('Đã bắt được lỗi không mong muốn:', err.message);
    // Bạn có thể làm cleanup tại đây trước khi thoát
    process.exit(1); // Thoát ứng dụng
  });
  
  function crash() {
    // Đây là lỗi không nằm trong try/catch
    nonExistentFunction(); // Gây lỗi
  }
  
  crash();
  