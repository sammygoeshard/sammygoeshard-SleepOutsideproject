import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageSrc = product.Images?.PrimaryMedium || product.Image;
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
      <img src="${imageSrc}" alt="${product.NameWithoutBrand}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    this.products = await this.dataSource.getData(this.category);
    this.renderList(this.products);
    this.attachFilterEvents();
  }

  attachFilterEvents() {
    const searchInput = document.querySelector("#product-search");
    const minPriceInput = document.querySelector("#product-min-price");
    const maxPriceInput = document.querySelector("#product-max-price");
    const clearButton = document.querySelector("#clear-filters");

    const update = () => {
      const searchValue = searchInput?.value || "";
      const minValue = minPriceInput?.value || "";
      const maxValue = maxPriceInput?.value || "";
      this.applyFilter(searchValue, minValue, maxValue);
    };

    searchInput?.addEventListener("input", update);
    minPriceInput?.addEventListener("input", update);
    maxPriceInput?.addEventListener("input", update);
    clearButton?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
      this.renderList(this.products);
    });
  }

  applyFilter(searchText, minPriceText, maxPriceText) {
    const normalizedText = searchText.trim().toLowerCase();
    const hasMinPrice = minPriceText.trim() !== "";
    const hasMaxPrice = maxPriceText.trim() !== "";
    const minPrice = Number(minPriceText);
    const maxPrice = Number(maxPriceText);

    const filteredProducts = this.products.filter((product) => {
      const nameMatch = product.NameWithoutBrand
        .toLowerCase()
        .includes(normalizedText);
      const price = Number(product.FinalPrice || 0);

      const minOk = hasMinPrice ? price >= minPrice : true;
      const maxOk = hasMaxPrice ? price <= maxPrice : true;

      return nameMatch && minOk && maxOk;
    });

    this.renderList(filteredProducts);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
