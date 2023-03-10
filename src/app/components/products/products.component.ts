import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateProduct, Products, UpdateProduct } from '../../models';
import { StoreServiceService } from '../../services/store.services.service';
import { ProductsServiceService } from '../../services/products.service.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  shoppingCart: Products[] = [];
  total = 0;
  limit = 10;
  offset = 0;

  @Input() productsList: Products[] = [];
  productToggle = false;



  status: 'loading' | 'success' | 'error' | 'init' = 'init';

  @Output() onLoadContent: EventEmitter<string> = new EventEmitter<string>();

  productChosen: Products = {
    id: '',
    title: '',
    images: '',
    price: 0,
    description: '',
    category: {
      id: '',
      name: '',
    },
  };

  toggleProductDatail() {
    this.productToggle = !this.productToggle;
  }

  constructor(
    private storeService: StoreServiceService,
    private productService: ProductsServiceService
  ) {
    this.shoppingCart = storeService.getShoppingCart();
  }

  // ngOnInit(): void {
  //   this.productService.getAll(10, 0).subscribe((data) => {
  //     this.productsList = data;
  //     this.offset += this.limit;
  //   })
  // }

  loadContent() {
    return this.onLoadContent.emit();

    // this.status = 'loading';
    // this.productService
    //   .getProductByPage(this.limit, this.offset)
    //   .subscribe((data) => {
    //     this.productsList = data;
    //     this.offset += this.limit;
    //     this.status = 'success';
    //   }),
    //   (error: any) => {
    //     this.status = 'error';
    //     console.log(error);
    //   };
  }

  onAddToShoppingCart(product: Products): void {
    this.storeService.addToShoppingCart(product);
    this.total = this.storeService.getTotal();
  }

  onShowtDetail(id: string) {
    this.status = 'loading';
    this.productService.getProduct(id).subscribe(
      (data) => {
        this.productChosen = data;
        this.toggleProductDatail();
      },
      (err) => {
        this.status = 'error';
        console.log(err);
      }
    );
  }

  createProduct(): void {
    const newProduct: CreateProduct = {
      title: 'My product',
      price: 1000,
      description: 'My Description',
      categoryId: 3,
      images: 'https://placeimg.com/640/480/',
    };
    this.productService.create(newProduct).subscribe((data) => {
      console.log(data);
      this.productsList.unshift(data);
    });
  }

  updateProduct() {
    const change: UpdateProduct = {
      title: 'Pencil',
    };

    const id = this.productChosen.id;
    this.productService.update(change, id).subscribe((data) => {
      let prod = this.productsList.findIndex((item) => item.id === id);
      this.productsList[prod] = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productService.delete(id).subscribe(() => {
      let prodIndex = this.productsList.findIndex((item) => item.id === id);
      this.productsList.splice(prodIndex, 1);
      this.productToggle = false;
    });
  }
}
