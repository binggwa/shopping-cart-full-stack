import { runApp } from "./app";
import InMemoryCartRepository from "./repositories/InMemoryCartRepository";
import InMemoryProductRepository from "./repositories/InMemoryProductRepository";

const PORT = process.env.PORT ?? 3000;

const repositories = {
  productRepo: new InMemoryProductRepository(),
  cartRepo: new InMemoryCartRepository()
};

repositories.productRepo.addProduct({
  name: "아메리카노",
  price: 4500,
  thumbnailUrl: "https://media.sodagift.com/img/image/665587415880572.jpg",
  totalQuantity: 999,
});

repositories.productRepo.addProduct({
  name: "바닐라 라떼",
  price: 5500,
  thumbnailUrl: "https://thebreadbag.co.kr/wp-content/uploads/2025/03/%EB%B9%B5%EB%B0%B1%ED%99%94%EC%A0%90_%EC%A0%95%EC%82%AC%EA%B0%81-1280x1280_0000s_0005_%EB%B0%B0%EB%AF%BC1280x960_%EC%9D%8C%EB%A3%8C_%EB%B3%B4%EC%A0%95%EB%B3%B8_0005_%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC-%EB%B3%B5%EC%82%AC.jpg",
  totalQuantity: 999,
});

repositories.cartRepo.addProductToCart(1, 2);
repositories.cartRepo.addProductToCart(2, 1);

const app = runApp(repositories);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
