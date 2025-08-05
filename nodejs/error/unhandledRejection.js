process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason.message);
    process.exit(1);
  });
  
  function doSomethingAsync() {
    // Trả về Promise bị reject nhưng không xử lý catch
    return Promise.reject(new Error("Lỗi từ async function!"));
  }
  
  doSomethingAsync(); // Bị từ chối nhưng không có catch