import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BrandsService } from '../../brands/brands.service';
import { BrandPageType } from '../types/brand-page.type';
import { BrandType } from '../types/brand.type';
import { CreateBrandInput } from '../types/create-brand.input';
import { UpdateBrandInput } from '../types/update-brand.input';

@Resolver(() => BrandType)
export class BrandsResolver {
  constructor(private readonly brandsService: BrandsService) {}

  @Query(() => BrandPageType, { description: 'Get paginated brands' })
  brands(
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ) {
    return this.brandsService.findPaginated({ page, limit });
  }

  @Query(() => BrandType, { description: 'Get one brand by id' })
  brand(@Args('id', { type: () => Int }) id: number) {
    return this.brandsService.findOne(id);
  }

  @Mutation(() => BrandType, { description: 'Create a new brand' })
  createBrand(@Args('input') input: CreateBrandInput) {
    return this.brandsService.create(input);
  }

  @Mutation(() => BrandType, { description: 'Update an existing brand' })
  updateBrand(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateBrandInput,
  ) {
    return this.brandsService.update(id, input);
  }

  @Mutation(() => BrandType, { description: 'Delete a brand' })
  deleteBrand(@Args('id', { type: () => Int }) id: number) {
    return this.brandsService.remove(id);
  }
}