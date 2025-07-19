import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Event Management App (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;
  let eventId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toBe('testuser');
          expect(res.body.user.email).toBe('test@example.com');
          authToken = res.body.accessToken;
          userId = res.body.user.id;
        });
    });

    it('/auth/login (POST) - should login user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.username).toBe('testuser');
        });
    });

    it('/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('/auth/profile (GET) - should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('username');
          expect(res.body).toHaveProperty('email');
        });
    });

    it('/auth/profile (GET) - should fail without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('Events', () => {
    it('/events (POST) - should create a new event', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Test Event')
        .field('description', 'Test Event Description')
        .field('startDate', '2024-07-15T18:00:00Z')
        .field('endDate', '2024-07-15T22:00:00Z')
        .field('totalGuests', '100')
        .field('category', 'Test')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Event');
          expect(res.body.description).toBe('Test Event Description');
          expect(res.body.userId).toBe(userId);
          eventId = res.body.id;
        });
    });

    it('/events (GET) - should get all events', () => {
      return request(app.getHttpServer())
        .get('/events')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('events');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.events)).toBe(true);
        });
    });

    it('/events (GET) - should get events with pagination', () => {
      return request(app.getHttpServer())
        .get('/events?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.limit).toBe(5);
        });
    });

    it('/events (GET) - should get events with search', () => {
      return request(app.getHttpServer())
        .get('/events?search=Test')
        .expect(200)
        .expect((res) => {
          expect(res.body.events.length).toBeGreaterThan(0);
        });
    });

    it('/events/:id (GET) - should get specific event', () => {
      return request(app.getHttpServer())
        .get(`/events/${eventId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(eventId);
          expect(res.body.title).toBe('Test Event');
        });
    });

    it('/events/:id (GET) - should return 404 for non-existent event', () => {
      return request(app.getHttpServer()).get('/events/99999').expect(404);
    });

    it('/events/:id (PUT) - should update event', () => {
      return request(app.getHttpServer())
        .put(`/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Updated Test Event')
        .field('description', 'Updated Description')
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Test Event');
          expect(res.body.description).toBe('Updated Description');
        });
    });

    it('/events/:id (PUT) - should fail to update event with wrong user', async () => {
      // Create another user
      const anotherUser = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'anotheruser',
          email: 'another@example.com',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .put(`/events/${eventId}`)
        .set('Authorization', `Bearer ${anotherUser.body.accessToken}`)
        .field('title', 'Unauthorized Update')
        .expect(404);
    });

    it('/events/:id (DELETE) - should delete event', () => {
      return request(app.getHttpServer())
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('/events/:id (DELETE) - should return 404 after deletion', () => {
      return request(app.getHttpServer()).get(`/events/${eventId}`).expect(404);
    });
  });

  describe('Users', () => {
    it('/users (GET) - should get all users', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          // Should not include password
          expect(res.body[0]).not.toHaveProperty('password');
        });
    });

    it('/users/:id (GET) - should get specific user', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(userId);
          expect(res.body.username).toBe('testuser');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('/users/:id (PUT) - should update user', () => {
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toBe('updateduser');
          expect(res.body.email).toBe('updated@example.com');
        });
    });

    it('/users/:id (DELETE) - should delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(200);
    });
  });

  describe('Validation', () => {
    it('/auth/register (POST) - should validate required fields', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: '',
          email: 'invalid-email',
          password: '123', // too short
        })
        .expect(400);
    });

    it('/events (POST) - should validate event fields', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', '') // empty title
        .field('startDate', 'invalid-date')
        .field('endDate', '2024-07-15T22:00:00Z')
        .expect(400);
    });
  });

  describe('File Upload', () => {
    it('/events (POST) - should handle file upload', () => {
      return request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .field('title', 'Event with Image')
        .field('description', 'Event with uploaded image')
        .field('startDate', '2024-07-15T18:00:00Z')
        .field('endDate', '2024-07-15T22:00:00Z')
        .attach('images', Buffer.from('fake image data'), 'test-image.jpg')
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('images');
          expect(Array.isArray(res.body.images)).toBe(true);
        });
    });
  });
});
