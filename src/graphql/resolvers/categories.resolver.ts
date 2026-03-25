import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { BrandsService } from '../../brands/brands.service';
import { CategoriesService } from '../../categories/categories.service';
import { BrandType } from '../types/brand.type';
import { CategoryPageType } from '../types/category-page.type';
import { CategoryType } from '../types/category.type';
@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
  ) {}

  @Query(() => CategoryPageType, { description: 'Get paginated categories' })
  categories(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ) {
    return this.categoriesService.findPaginated({ page, limit });
  }

  @Query(() => CategoryType, { description: 'Get one category by id' })
  category(@Args('id', { type: () => Int }) id: number) {
    return this.categoriesService.findOne(id);
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
