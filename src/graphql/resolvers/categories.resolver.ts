import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { BrandsService } from '../../brands/brands.service';
import { CategoriesService } from '../../categories/categories.service';
import { BrandType } from '../types/brand.type';
import { CategoryPageType } from '../types/category-page.type';
import { CategoryType } from '../types/category.type';
import { CreateCategoryInput } from '../types/create-category.input';
import { UpdateCategoryInput } from '../types/update-category.input';

@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
  ) {}

  @Query(() => CategoryPageType, { description: 'Get paginated categories' })
  categories(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.categoriesService.findPaginated({ page, limit });
  }

  @Query(() => CategoryType, { description: 'Get one category by id' })
  category(@Args('id', { type: () => Int }) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => CategoryType, { description: 'Create a new category' })
  createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoriesService.create(input);
  }

  @Mutation(() => CategoryType, { description: 'Update an existing category' })
  updateCategory(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(id, input);
  }

  @Mutation(() => CategoryType, { description: 'Delete a category' })
  deleteCategory(@Args('id', { type: () => Int }) id: number) {
    return this.categoriesService.remove(id);
  }

  @ResolveField(() => BrandType, {
    nullable: true,
    description: 'Resolve the brand of a category',
  })
  brand(@Parent() category: CategoryType) {
    if (category.brand) {
      return category.brand;
    }

    return this.brandsService.findOne(category.brandId);
  }
}
