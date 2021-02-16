const Product = function (
  id,
  name,
  price,
  img,
  type,
  screen,
  backCamera,
  frontCamera,
  desc
) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.img = img;
  this.type = type;
  this.screen = screen;
  this.backCamera = backCamera;
  this.frontCamera = frontCamera;
  this.desc = desc;
};
