import * as request from 'supertest';
import * as mongoose from 'mongoose';
import axios from 'axios';
import { RegisterDTO } from '../src/auth/auth.dto';
import { app } from './constants';
import { CreateProductDTO } from '../src/product/product.dto';
import { HttpStatus } from '@nestjs/common';

let sellerToken: string;
let productSeller: RegisterDTO = {
  seller: true,
  username: 'productSeller',
  password: 'password',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
  await mongoose.connection.db.dropDatabase();

  const {
    data: { token },
  } = await axios.post(`${app}/auth/register`, productSeller);
  sellerToken = token;
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('PRODUCT', () => {
  const product: CreateProductDTO = {
    title: 'New Cocaine',
    description: 'Iz good.',
    price: 100,
    image: 'n/a',
  };

  let productId: string;

  it('should list all products', () => {
    return request(app)
      .get('/product')
      .expect(200);
  });

  it('should list my products', () => {
    return request(app)
      .get('/product/mine')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200);
  });

  it('should create product', () => {
    return request(app)
      .post('/product')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send(product)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        productId = body._id;
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(HttpStatus.CREATED);
  });

  it('should read product', () => {
    return request(app)
      .get(`/product/${productId}`)
      .expect(({ body }) => {
        expect(body._id).toEqual(productId);
        expect(body.title).toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(200);
  });

  it('should update product', () => {
    return request(app)
      .put(`/product/${productId}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ title: 'Moar cocaine' })
      .expect(({ body }) => {
        expect(body._id).toEqual(productId);
        expect(body.title).not.toEqual(product.title);
        expect(body.description).toEqual(product.description);
        expect(body.price).toEqual(product.price);
        expect(body.image).toEqual(product.image);
        expect(body.owner.username).toEqual(productSeller.username);
      })
      .expect(200);
  });

  it('should delete product', async () => {
    await axios.delete(`${app}/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${sellerToken}`,
      },
    });
    return request(app)
      .get(`product/${productId}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
