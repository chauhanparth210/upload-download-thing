export const mockFileRepository = {
  create: jest.fn(),
  insert: jest.fn(),
  manager: {
    query: jest.fn(),
  },
  findOne: jest.fn(),
  update: jest.fn(),
};
