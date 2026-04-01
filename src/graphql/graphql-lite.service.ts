// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CategoriesService } from '../categories/categories.service';
// import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
// import { CreateProductDto } from '../products/dto/create-products.dto';
// import { UpdateProductDto } from '../products/dto/update-products.dto';
// import { ProductsService } from '../products/products.service';
// import { CreateCategoryDto } from '../categories/dto/create-categories.dto';
// import { UpdateCategoryDto } from '../categories/dto/update-categories.dto';

// interface FieldNode {
//   name: string;
//   children?: FieldNode[];
// }

// interface ParsedOperation {
//   operationType: 'query' | 'mutation';
//   fieldName: string;
//   args: Record<string, unknown>;
//   selection: FieldNode[];
// }

// @Injectable()
// export class GraphqlLiteService {
//   private readonly maxComplexity = 40;

//   constructor(
//     private readonly productsService: ProductsService,
//     private readonly categoriesService: CategoriesService,
//   ) {}

//   schema() {
//     return `
// scalar DateTime

// type PageMeta {
//   page: Int!
//   limit: Int!
//   totalItems: Int!
//   totalPages: Int!
// }

// type Brand {
//   id: Int!
//   name: String!
//   createdAt: DateTime!
//   updatedAt: DateTime!
// }

// type Category {
//   id: Int!
//   name: String!
//   brandId: Int!
//   createdAt: DateTime!
//   updatedAt: DateTime!
//   brand: Brand
// }

// type Product {
//   id: Int!
//   name: String!
//   description: String!
//   price: Float!
//   stock: Int!
//   categoryId: Int!
//   createdAt: DateTime!
//   updatedAt: DateTime!
//   category: Category
// }

// type ProductPage {
//   data: [Product!]!
//   meta: PageMeta!
// }

// type CategoryPage {
//   data: [Category!]!
//   meta: PageMeta!
// }

// input CreateProductInput {
//   name: String!
//   description: String!
//   price: Float!
//   stock: Int!
//   categoryId: Int!
// }

// input UpdateProductInput {
//   name: String
//   description: String
//   price: Float
//   stock: Int
//   categoryId: Int
// }

// input CreateCategoryInput {
//   name: String!
//   brandId: Int!
// }

// input UpdateCategoryInput {
//   name: String
//   brandId: Int
// }

// type Query {
//   products(page: Int = 1, limit: Int = 10): ProductPage!
//   product(id: Int!): Product!
//   categories(page: Int = 1, limit: Int = 10): CategoryPage!
//   category(id: Int!): Category!
// }

// type Mutation {
//   createProduct(input: CreateProductInput!): Product!
//   updateProduct(id: Int!, input: UpdateProductInput!): Product!
//   deleteProduct(id: Int!): Product!
//   createCategory(input: CreateCategoryInput!): Category!
//   updateCategory(id: Int!, input: UpdateCategoryInput!): Category!
//   deleteCategory(id: Int!): Category!
// }
// `.trim();
//   }

//   async execute(query: string, variables: Record<string, unknown> = {}) {
//     const normalizedQuery = query.replace(/#[^\n]*/g, '').trim();
//     const parsed = this.parseOperation(normalizedQuery, variables);
//     const complexity = this.calculateComplexity(parsed.selection);

//     if (complexity > this.maxComplexity) {
//       throw new BadRequestException(
//         `GraphQL query is too complex (${complexity}). Max allowed complexity is ${this.maxComplexity}`,
//       );
//     }

//     const resolved = await this.resolveOperation(parsed);

//     return {
//       data: {
//         [parsed.fieldName]: this.pickFields(resolved, parsed.selection),
//       },
//       extensions: {
//         complexity,
//         maxComplexity: this.maxComplexity,
//       },
//     };
//   }

//   private async resolveOperation(parsed: ParsedOperation) {
//     switch (parsed.fieldName) {
//       case 'products': {
//         const query: PaginationQueryDto = {
//           page: Number(parsed.args.page ?? 1),
//           limit: Number(parsed.args.limit ?? 10),
//         };
//         return this.productsService.findPaginated(query);
//       }
//       case 'product':
//         return this.productsService.findOne(Number(parsed.args.id));
//       case 'categories': {
//         const query: PaginationQueryDto = {
//           page: Number(parsed.args.page ?? 1),
//           limit: Number(parsed.args.limit ?? 10),
//         };
//         return this.categoriesService.findPaginated(query);
//       }
//       case 'category':
//         return this.categoriesService.findOne(Number(parsed.args.id));
//       case 'createProduct':
//         return this.productsService.create(
//           parsed.args.input as CreateProductDto,
//         );
//       case 'updateProduct':
//         return this.productsService.update(
//           Number(parsed.args.id),
//           parsed.args.input as UpdateProductDto,
//         );
//       case 'deleteProduct':
//         return this.productsService.remove(Number(parsed.args.id));
//       case 'createCategory':
//         return this.categoriesService.create(
//           parsed.args.input as CreateCategoryDto,
//         );
//       case 'updateCategory':
//         return this.categoriesService.update(
//           Number(parsed.args.id),
//           parsed.args.input as UpdateCategoryDto,
//         );
//       case 'deleteCategory':
//         return this.categoriesService.remove(Number(parsed.args.id));
//       default:
//         throw new BadRequestException(
//           `Unsupported root field: ${parsed.fieldName}`,
//         );
//     }
//   }

//   private parseOperation(
//     query: string,
//     variables: Record<string, unknown>,
//   ): ParsedOperation {
//     const operationType = query.startsWith('mutation') ? 'mutation' : 'query';
//     const bodyStart = query.indexOf('{');
//     const bodyEnd = query.lastIndexOf('}');

//     if (bodyStart === -1 || bodyEnd === -1) {
//       throw new BadRequestException('Invalid GraphQL document');
//     }

//     const body = query.slice(bodyStart + 1, bodyEnd).trim();
//     let cursor = 0;
//     cursor = this.skipWhitespace(body, cursor);

//     const fieldName = this.readIdentifier(body, cursor);
//     cursor += fieldName.length;
//     cursor = this.skipWhitespace(body, cursor);

//     let args: Record<string, unknown> = {};
//     if (body[cursor] === '(') {
//       const end = this.findMatching(body, cursor, '(', ')');
//       args = this.parseArguments(body.slice(cursor + 1, end), variables);
//       cursor = end + 1;
//     }

//     cursor = this.skipWhitespace(body, cursor);
//     if (body[cursor] !== '{') {
//       throw new BadRequestException('Selection set is required');
//     }

//     const selectionEnd = this.findMatching(body, cursor, '{', '}');
//     const selection = this.parseSelectionSet(
//       body.slice(cursor + 1, selectionEnd),
//     );

//     return { operationType, fieldName, args, selection };
//   }

//   private parseArguments(
//     source: string,
//     variables: Record<string, unknown>,
//   ): Record<string, unknown> {
//     const jsonLike = source
//       .replace(/([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '"$1":')
//       .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_full, name: string) =>
//         JSON.stringify(variables[name]),
//       )
//       .replace(/'/g, '"');

//     try {
//       return JSON.parse(`{${jsonLike}}`) as Record<string, unknown>;
//     } catch {
//       throw new BadRequestException('Unable to parse GraphQL arguments');
//     }
//   }

//   private parseSelectionSet(source: string): FieldNode[] {
//     const fields: FieldNode[] = [];
//     let cursor = 0;

//     while (cursor < source.length) {
//       cursor = this.skipWhitespace(source, cursor);
//       if (cursor >= source.length) {
//         break;
//       }

//       const name = this.readIdentifier(source, cursor);
//       if (!name) {
//         cursor += 1;
//         continue;
//       }
//       cursor += name.length;
//       cursor = this.skipWhitespace(source, cursor);

//       let children: FieldNode[] | undefined;
//       if (source[cursor] === '{') {
//         const end = this.findMatching(source, cursor, '{', '}');
//         children = this.parseSelectionSet(source.slice(cursor + 1, end));
//         cursor = end + 1;
//       }

//       fields.push({ name, children });
//     }

//     return fields;
//   }

//   private calculateComplexity(selection: FieldNode[], depth = 1): number {
//     return selection.reduce((sum, field) => {
//       const nestedCost = field.children
//         ? this.calculateComplexity(field.children, depth + 1)
//         : 0;
//       return sum + depth + nestedCost;
//     }, 0);
//   }

//   private pickFields(value: unknown, selection: FieldNode[]): unknown {
//     if (Array.isArray(value)) {
//       return value.map((item) => this.pickFields(item, selection));
//     }

//     if (value === null || typeof value !== 'object') {
//       return value;
//     }

//     const source = value as Record<string, unknown>;
//     const result: Record<string, unknown> = {};

//     for (const field of selection) {
//       const fieldValue = source[field.name];
//       result[field.name] = field.children
//         ? this.pickFields(fieldValue, field.children)
//         : this.normalizeScalar(fieldValue);
//     }

//     return result;
//   }

//   private normalizeScalar(value: unknown): unknown {
//     if (typeof value === 'bigint') {
//       return Number(value);
//     }

//     if (value instanceof Date) {
//       return value.toISOString();
//     }

//     if (
//       value &&
//       typeof value === 'object' &&
//       'toNumber' in (value as Record<string, unknown>) &&
//       typeof (value as { toNumber?: unknown }).toNumber === 'function'
//     ) {
//       return (value as { toNumber: () => number }).toNumber();
//     }

//     return value;
//   }

//   private skipWhitespace(source: string, cursor: number) {
//     while (/\s|,/.test(source[cursor] ?? '')) {
//       cursor += 1;
//     }
//     return cursor;
//   }

//   private readIdentifier(source: string, cursor: number) {
//     const match = /^[A-Za-z_][A-Za-z0-9_]*/.exec(source.slice(cursor));
//     if (!match) {
//       return '';
//     }
//     return match[0];
//   }

//   private findMatching(
//     source: string,
//     start: number,
//     open: string,
//     close: string,
//   ) {
//     let depth = 0;
//     let inString = false;

//     for (let index = start; index < source.length; index += 1) {
//       const char = source[index];
//       if (char === '"' && source[index - 1] !== '\\') {
//         inString = !inString;
//       }
//       if (inString) {
//         continue;
//       }
//       if (char === open) {
//         depth += 1;
//       }
//       if (char === close) {
//         depth -= 1;
//         if (depth === 0) {
//           return index;
//         }
//       }
//     }

//     throw new BadRequestException('Unbalanced GraphQL document');
//   }
// }