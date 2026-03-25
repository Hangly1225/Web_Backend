import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CategoriesService } from '../../categories/categories.service';
import { ProductsService } from '../../products/products.service';
import { CreateProductInput } from '../types/create-product.input';
import { ProductPageType } from '../types/product-page.type';
import { ProductType } from '../types/product.type';
import { CategoryType } from '../types/category.type';
import { UpdateProductInput } from '../types/update-product.input';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Query(() => ProductPageType, { description: 'Get paginated products' })
  products(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.productsService.findPaginated({ page, limit });
  }

  @Query(() => ProductType, { description: 'Get one product by id' })
  product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductType, { description: 'Create a new product' })
  createProduct(@Args('input') input: CreateProductInput) {
    return this.productsService.create(input);
  }

  @Mutation(() => ProductType, { description: 'Update an existing product' })
  updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductInput,
  ) {
    return this.productsService.update(id, input);
  }

  @Mutation(() => ProductType, { description: 'Delete a product' })
  deleteProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.remove(id);
  }

  @ResolveField(() => CategoryType, {
    nullable: true,
    description: 'Resolve the category of a product',
  })
  category(@Parent() product: ProductType) {
    if (product.category) {
      return product.category;
    }

    return this.categoriesService.findOne(product.categoryId);
  }
}
