let productList = [];

const handleCreateProduct = () => {
  //1.dom input lấy value
  const id = document.getElementById("txtProductId").value;
  const name = document.getElementById("txtProductName").value;
  const price = document.getElementById("txtPrice").value;
  const img = document.getElementById("txtImg").value;
  const type = document.getElementById("txtType").value;
  const screen = document.getElementById("txtScreen").value;
  const backCamera = document.getElementById("txtBackCamera").value;
  const frontCamera = document.getElementById("backCameraError").value;
  const desc = document.getElementById("txtDesc").value;

  //tạo ra một object product lưu info
  const newProduct = new Product(
    id,
    name,
    price,
    img,
    type,
    screen,
    backCamera,
    frontCamera,
    desc
  );
  //call api lưu product vào database
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "POST",
    data: newProduct,
  })
    .then(function (res) {
      console.log(res);
      //gọi api fetchProducts để cập nhật lại giao diện
      fetchProducts();
    })
    .catch(function (err) {
      console.log(err);
    });
};

//yêu cầu: data phải là 1 array chưa đối tượng product
const createTable = (data) => {
  let productHTML = "";
  for (let i = 0; i < data.length; i++) {
    productHTML += `<tr>
        <td>${data[i].id} </td> 
        <td>${data[i].name}</td> 
        <td>${data[i].price}</td> 
        <td><img
        style="width: 50px"
        src="${data[i].img}"
      /></td> 
        <td>${data[i].type}</td>
        <td>
            <button onclick="handleDeleteProduct('${data[i].id}')" style="width:40px; height:40px" class="btn btn-danger rounded-circle">
                <i class="fa fa-trash"></i>
            </button>
            <button onclick="handleGetUpdatedProduct('${data[i].id}')" style="width:40px; height:40px" class="btn btn-info rounded-circle">
                <i class="fa fa-pencil-alt"></i>
            </button>
        </td>
      </tr>`;
  }
  document.getElementById("tbodyProduct").innerHTML = productHTML;
};

//get Products from DB
const fetchProducts = () => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      console.log(res);
      //chuyển đổi data
      let mappedData = mapData(res.data);
      //render table
      createTable(mappedData);
    })
    .catch(function (err) {
      console.log(err);
    });
};

const mapData = (dataFromDB) => {
  //Tạo 1 mảng mappedData để chứa dữ liệu map dc từ backend
  let mappedData = [];
  for (let i = 0; i < dataFromDB.length; i++) {
    let mappedProduct = new Product(
      dataFromDB[i].id,
      dataFromDB[i].name,
      dataFromDB[i].price,
      dataFromDB[i].img,
      dataFromDB[i].type,
      dataFromDB[i].screen,
      dataFromDB[i].backCamera,
      dataFromDB[i].frontCamera,
      dataFromDB[i].desc
    );
    mappedData.push(mappedProduct);
  }
  return mappedData;
};

const handleDeleteProduct = (id) => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + `${id}`,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
};

const handleGetUpdatedProduct = (id) => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + `${id}`,
    method: "GET",
  })
    .then(function (res) {
      document.getElementById("txtProductId").value = res.data.id;
      document.getElementById("txtProductName").value = res.data.name;
      document.getElementById("txtPrice").value = res.data.price;
      document.getElementById("txtImg").value = res.data.img;
      document.getElementById("txtType").value = res.data.type;
      document.getElementById("txtScreen").value = res.data.screen;
      document.getElementById("txtBackCamera").value = res.data.backCamera;
      document.getElementById("txtFrontCamera").value = res.data.frontCamera;
      document.getElementById("txtDesc").value = res.data.desc;
    })
    .catch(function (err) {
      console.log(err);
    });

  document.getElementById("txtProductId").setAttribute("disabled", true);
};

//Lưu dữ liệu sản phẩm sửa vào hệ thống
const handleUpdateProduct = () => {
  //lấy dữ liệu người dùng mới sửa
  const id = document.getElementById("txtProductId").value;
  const name = document.getElementById("txtProductName").value;
  const price = document.getElementById("txtPrice").value;
  const img = document.getElementById("txtImg").value;
  const type = document.getElementById("txtType").value;
  const screen = document.getElementById("txtScreen").value;
  const backCamera = document.getElementById("txtBackCamera").value;
  const frontCamera = document.getElementById("txtFrontCamera").value;
  const desc = document.getElementById("txtDesc").value;

  const updatedProduct = new Product(
    id,
    name,
    price,
    img,
    type,
    screen,
    backCamera,
    frontCamera,
    desc
  );

  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/" + `${id}`,
    method: "PUT",
    data: updatedProduct,
  })
    .then(function (res) {
      console.log(res);
      fetchProducts();
    })
    .catch(function (err) {
      console.log(err);
    });
};

const handleSearchProducts = () => {
  let result = [];
  //Dom tới input lấy keyword
  let keyword = document.getElementById("txtSearch").value;

  //Chuyển keyword về chứ thường
  keyword = keyword.toLowerCase().trim();

  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      console.log(res);
      //chuyển đổi data
      let mappedData = mapData(res.data);
      for (let i = 0; i < mappedData.length; i++) {
        let convertedProductName = mappedData[i].name.toLowerCase();
        if (
          mappedData[i].id == keyword ||
          convertedProductName.includes(keyword)
        ) {
          result.push(mappedData[i]);
        }
      }
      createTable(result);
    })
    .catch(function (err) {
      console.log(err);
    });
};

fetchProducts();
