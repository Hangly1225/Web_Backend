// import { GraphqlLiteService } from './graphql-lite.service';

// describe('GraphqlLiteService', () => {
//   it('returns selected product page fields', async () => {
//     const service = new GraphqlLiteService(
//       {
//         findPaginated: jest.fn().mockResolvedValue({
//           data: [
//             {
//               id: 1,
//               name: 'Classic Bracelet',
//               price: { toNumber: () => 79.99 },
//               stock: 3,
//               category: {
//                 id: 2,
//                 name: 'Bracelets',
//                 brand: { id: 5, name: 'Elegance' },
//               },
//             },
//           ],
//           meta: { page: 1, limit: 10, totalItems: 1, totalPages: 1 },
//         }),
//         findOne: jest.fn(),
//         create: jest.fn(),
//         update: jest.fn(),
//         remove: jest.fn(),
//       } as never,
//       {
//         findPaginated: jest.fn(),
//         findOne: jest.fn(),
//       } as never,
//     );

//     const result = await service.execute(`query {
//       products(page: 1, limit: 10) {
//         data {
//           id
//           name
//           category {
//             name
//             brand {
//               name
//             }
//           }
//         }
//         meta {
//           page
//           totalPages
//         }
//       }
//     }`);

//     expect(result).toEqual({
//       data: {
//         products: {
//           data: [
//             {
//               id: 1,
//               name: 'Classic Bracelet',
//               category: {
//                 name: 'Bracelets',
//                 brand: {
//                   name: 'Elegance',
//                 },
//               },
//             },
//           ],
//           meta: {
//             page: 1,
//             totalPages: 1,
//           },
//         },
//       },
//       extensions: {
//         complexity: expect.any(Number),
//         maxComplexity: 40,
//       },
//     });
//   });
// });