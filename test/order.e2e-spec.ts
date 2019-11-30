import * as request from 'supertest';
import * as mongoose from 'mongoose';
import axios from 'axios';
import { RegisterDTO } from '../src/auth/auth.dto';
import { app } from './constants';
import { CreateProductDTO } from '../src/product/product.dto';
import { HttpStatus } from '@nestjs/common';
import { Product } from '../src/types/product';

let sellerToken: string;
let buyerToken: string;
let boughtProducts: Product[];

const orderBuyer: RegisterDTO = {
  seller: false,
  username: 'orderBuyer',
  password: 'password',
};
let orderSeller: RegisterDTO = {
  seller: true,
  username: 'productSeller',
  password: 'password',
};

const soldProducts: CreateProductDTO[] = [
  {
    title: 'newnew phone',
    image: 'na',
    description: 'description phone',
    price: 200,
  },
  {
    title: 'supernew phone',
    image: 'na',
    description: 'some desc',
    price: 20,
  },
];

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await mongoose.connection.db.dropDatabase();

  ({
    data: { token: sellerToken },
  } = await axios.post(`${app}/auth/register`, orderSeller));
  ({
    data: { token: buyerToken },
  } = await axios.post(`${app}/auth/register`, orderBuyer));

  const res = Promise.all(
    soldProducts.map(
      async product =>
        await axios.post(`${app}/product`, product, {
          headers: {
            authorization: `Bearer ${sellerToken}`,
          },
        }),
    ),
  );

  console.log('res', res);
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ORDER', () => {
  it('should workd', () => {
    expect(true).toBeTruthy();
  });
});
