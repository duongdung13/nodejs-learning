// const original = {
//     name: 'Alice 1',
//     address: { city: 'Hanoi 1' }
//   };
//   console.log(`original {}`, original);

//   const shallow = { ...original };
//   console.log(`1 shallow {}`, shallow);

//   shallow.name = 'Bob 2';            // ✅ Thay đổi độc lập
//   shallow.address.city = 'Saigon 2'; // ❌ Thay đổi cả original.address.city
//   console.log(`2 shallow {}`, shallow);
//   console.log(`original {}`, original);
// sao chép cấp 1 có nghĩa là object mới tạo sẽ được sao chép cấp 1, còn cấp dưới là tham chiếu giá trị,
// nghĩa là object mới set giá trị cấp 1 thì object cũ không bị thay đổi 
// object mới set giá trị từ cấp 2 trở xuống thì object cũ bị thay đổi


const original = {
    name: 'Alice 1',
    address: { city: 'Hanoi 1' }
  };
  console.log(`original {}`, original);

  const deep = structuredClone(original); // Hoặc dùng thư viện
  console.log(`deep {}`, deep);

  deep.name = 'Bob 2';
  deep.address.city = 'Saigon 2';
  console.log(` sau khi set - deep {}`, deep);

  console.log(`original gốc `, original); // 'Hanoi' ✅ Không bị ảnh hưởng