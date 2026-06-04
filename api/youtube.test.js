import { jest } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import handler from './youtube.js';

describe('YouTube API Proxy', () => {
  const originalEnv = process.env;
  let originalFetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    originalFetch = global.fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns 200 with error when YOUTUBE_API_KEY is missing', async () => {
    delete process.env.YOUTUBE_API_KEY;

    const { req, res } = createMocks({
      method: 'GET',
      query: { channelId: 'UC123' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'NO_KEY',
      message: 'YOUTUBE_API_KEY not set in Vercel environment variables.',
      setup: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add YOUTUBE_API_KEY'
    });
  });

  it('returns 400 when channelId is missing', async () => {
    process.env.YOUTUBE_API_KEY = 'test_api_key';

    const { req, res } = createMocks({
      method: 'GET',
      query: {}, // no channelId
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Channel ID required. Use ?channelId=UC...'
    });
  });

  it('returns 200 for OPTIONS requests', async () => {
    const { req, res } = createMocks({
      method: 'OPTIONS',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('returns 200 and channel data for successful requests', async () => {
    process.env.YOUTUBE_API_KEY = 'test_api_key';

    const mockApiResponse = {
      items: [{
        snippet: {
          title: 'Test Channel',
          description: 'A test channel',
          thumbnails: {
            high: { url: 'http://example.com/thumb.jpg' }
          },
          publishedAt: '2023-01-01T00:00:00Z',
          country: 'US'
        },
        statistics: {
          viewCount: '1000',
          subscriberCount: '500',
          videoCount: '10',
          hiddenSubscriberCount: false
        }
      }]
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    );

    const { req, res } = createMocks({
      method: 'GET',
      query: { channelId: 'UC123' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('LINK_ESTABLISHED');
    expect(data.channel.title).toBe('Test Channel');
    expect(data.stats.views).toBe(1000);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=UC123&key=test_api_key'
    );
  });
});
