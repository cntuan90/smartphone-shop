let productList = [];
let cartList = [];

const calcSum = (x, y) => {
  return x * y;
};

const showProducts = (data) => {
  let productHTML = "";
  for (let i = 0; i < data.length; i++) {
    productHTML += `
    <div class="col-3 mb-3 p-1">
    <div class="card p-1">
      <img
        style="height: 280px"
        src="${data[i].img}"
        class="w-100"
        alt=""
      />
      <p class="font-weight-bold mb-0">
        ${data[i].name}
      </p>
      <span class="text-danger font-weight-regular">
        ${data[i].price}$
      </span>
      <small>
        <b>Screen</b>: ${data[i].screen} </br>
        <b>Front Camera</b>: ${data[i].frontCamera} </br>
        <b>Back Camera</b>: ${data[i].backCamera} </br>
        <b>Describes</b>: ${data[i].desc}
      </small>
      <button type="button" onclick="addToCart(${data[i].id})" class="btn btn-success">Add to Cart</button>
    </div>
  </div>
    `;
  }
  document.getElementById("showProduct").innerHTML = productHTML;
};

const renderCart = (data) => {
  let productHTML = "";
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    productHTML += `
    <tr>
    <td>
      <img
        style="width: 50px"
        src="${data[i].img}"
      />
    </td>
    <td style="font-size: 20px">${data[i].name}</td>
    <td>${data[i].price}</td>
    <td>
    ${data[i].qty}
      <div class="btn-group">
        <button onclick="minus(${
          data[i].id
        })" type="button" class="btn btn-info border-right">-</button>
        <button onclick="plus(${
          data[i].id
        })" type="button" class="btn btn-info border-left">+</button>
      </div>
    </td>
    <td>${calcSum(data[i].price, data[i].qty)}</td>
    <td>
      <button onclick="handleRemoveProduct(${
        data[i].id
      })" class="btn btn-info">x</button>
    </td>
  </tr>
    `;
    total += calcSum(data[i].price, data[i].qty);
  }
  productHTML += `
  <tr>
      <td></td>
      <td></td>
      <td></td>
      <td style="font-size: 30px" class="font-weight-bold">
          Total
      </td>
      <td style="font-size: 30px" class="font-weight-bold">${total}</td>
      <td>
        <button type="button" onclick="btnCheckout()" style="font-size: 30px" class="btn btn-info">
          Checkout
        </button>
      </td>
  </tr>`;
  document.getElementById("tbodyCart").innerHTML = productHTML;
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

const fetchProducts = () => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "GET",
  })
    .then(function (res) {
      console.log(res);
      //chuyển đổi data
      productList = mapData(res.data);
      //render table
      showProducts(productList);
      console.log(productList);
    })
    .catch(function (err) {
      console.log(err);
    });
};
fetchProducts();

const sortProduct = () => {
  let sortedList = [];
  let temp = document.getElementById("filterProduct").value;
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].type == temp) {
      sortedList.push(productList[i]);
      showProducts(sortedList);
    }
  }
};

const addToCart = (data) => {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id == data) {
      const id = productList[i].id;
      const name = productList[i].name;
      const price = productList[i].price;
      const img = productList[i].img;
      const qty = 1;

      const updatedCart = new CartItem(id, name, price, img, qty);
      for (let i = 0; i < cartList.length; i++) {
        if (cartList[i].id == data) {
          cartList[i].qty += 1;
          renderCart(cartList);
          saveLocalStorage();
          return;
        }
      }
      cartList.push(updatedCart);
    }
  }
  document.getElementById("addSuccess").style.display = "inline-block";
  renderCart(cartList);
  saveLocalStorage();
};

const plus = (data) => {
  for (let i = 0; i < cartList.length; i++) {
    if (cartList[i].id == data) {
      cartList[i].qty += 1;
    }
  }
  renderCart(cartList);
  saveLocalStorage();
};

const minus = (data) => {
  for (let i = 0; i < cartList.length; i++) {
    if (cartList[i].id == data && cartList[i].qty > 0) {
      cartList[i].qty -= 1;
    }
    if (cartList[i].qty == 0) {
      cartList.splice(i, 1);
    }
  }
  renderCart(cartList);
  saveLocalStorage();
};

const btnCheckout = () => {
  let temp = [];
  cartList = temp;
  renderCart(cartList);
  saveLocalStorage();
};

const saveLocalStorage = () => {
  const cartListJSON = JSON.stringify(cartList);
  localStorage.setItem("dataCartList", cartListJSON);
};

const getDataFromLocalStorage = () => {
  const dataJSON = localStorage.getItem("dataCartList");
  if (!dataJSON) return;

  const data = JSON.parse(dataJSON);
  cartList = data;
  //Render bảng table
  renderCart(cartList);
};

getDataFromLocalStorage();

const handleRemoveProduct = (id) => {
  let foundedIndex;
  for (let i = 0; i < cartList.length; i++) {
    if (cartList[i].id == id) {
      foundedIndex = i;
      break;
    }
  }
  cartList.splice(foundedIndex, 1);
  renderCart(cartList);
  saveLocalStorage();
};
