// FAXX IMPERIAL — YouTube API Proxy
// Keeps your YOUTUBE_API_KEY secret. Frontend sends channel ID, backend calls Google.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://faxx.up.railway.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { channelId } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return res.status(200).json({
      error: 'NO_KEY',
      message: 'YOUTUBE_API_KEY not set in Vercel environment variables.',
      setup: 'Go to Vercel Dashboard → Your Project → Settings → Environment Variables → Add YOUTUBE_API_KEY'
    });
  }

  if (!channelId) {
    return res.status(400).json({ error: 'Channel ID required. Use ?channelId=UC...' });
  }

  try {
    // Call YouTube Data API v3
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${encodeURIComponent(channelId)}&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(200).json({
        error: 'YOUTUBE_API_ERROR',
        message: data.error.message,
        code: data.error.code
      });
    }

    const channel = data.items?.[0];
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found. Check the Channel ID.' });
    }

    const stats = channel.statistics;
    const snippet = channel.snippet;

    return res.status(200).json({
      status: 'LINK_ESTABLISHED',
      channel: {
        id: channelId,
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        publishedAt: snippet.publishedAt,
        country: snippet.country || 'Unknown'
      },
      stats: {
        views: parseInt(stats.viewCount || 0),
        subscribers: parseInt(stats.subscriberCount || 0),
        videos: parseInt(stats.videoCount || 0),
        hiddenSubscriberCount: stats.hiddenSubscriberCount
      },
      quotaUsed: '1 unit',
      fetchedAt: new Date().toISOString()
    });

  } catch (err) {
    return res.status(500).json({
      error: 'PROXY_ERROR',
      message: err.message
    });
  }
}
