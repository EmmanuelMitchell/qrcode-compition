const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();

// app.use(cors());

// app.use(cors({
//   origin: ["https://qrcode-compition.vercel.app", "http://localhost:3001"],
//   methods: "GET,POST,PUT,DELETE",
//   credentials: true
// }));
app.use(
  cors({
    origin: "*",
  })
);


app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Initialize shops with proper IDs and URLs
app.post('/api/init-shops', async (req, res) => {
  try {
    const shops = [
      { 
        id: 'bo-android', 
        name: 'Bo', 
        url: 'https://play.google.com/store/apps/details?id=com.bo.android', 
        platform: 'android' 
      },
      { 
        id: 'bo-iphone', 
        name: 'Bo', 
        url: 'https://apps.apple.com/app/bo-app', 
        platform: 'iphone' 
      },
      { 
        id: 'kenema-android', 
        name: 'Kenema', 
        url: 'https://play.google.com/store/apps/details?id=com.kenema.android', 
        platform: 'android' 
      },
      { 
        id: 'kenema-iphone', 
        name: 'Kenema', 
        url: 'https://apps.apple.com/app/kenema-app', 
        platform: 'iphone' 
      }
    ];

    for (const shop of shops) {
      await prisma.shop.upsert({
        where: { id: shop.id },
        update: shop,
        create: shop,
      });
    }

    res.json({ message: 'Shops initialized successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to initialize shops' });
  }
});

// Record a new scan
// app.post('/api/scans', async (req, res) => {
//   const { shopId, phoneNumber } = req.body;

//   try {
//     // Check if shop exists
//     const shop = await prisma.shop.findUnique({
//       where: { id: shopId },
//     });

//     if (!shop) {
//       return res.status(404).json({ error: 'Shop not found' });
//     }

//     // Create new scan
//     const scan = await prisma.scan.create({
//       data: {
//         shopId,
//         phoneNumber,
//       },
//     });

//     // Return both scan data and shop URL for redirect
//     res.json({
//       scan,
//       redirectUrl: shop.url
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to record scan' });
//   }
// });

app.post('/api/scans', async (req, res) => {
  const { shopId, phoneNumber } = req.body;

  try {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' }); // ✅ JSON response
    }

    const scan = await prisma.scan.create({ data: { shopId, phoneNumber } });

    res.json({ scan, redirectUrl: shop.url }); // ✅ Always return JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record scan' }); // ✅ JSON error response
  }
});


// Get dashboard data with formatted shop information
app.get('/api/dashboard', async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        scans: {
          select: {
            phoneNumber: true,
          },
        },
      },
    });

    const dashboardData = shops.map(shop => ({
      id: shop.id,
      name: shop.name,
      platform: shop.platform,
      url: shop.url,
      scanCount: shop.scans.length,
      uniquePhoneNumbers: [...new Set(shop.scans.map(scan => scan.phoneNumber))].length,
      qrUrl: `/scan/${shop.id}` // Adding QR URL to dashboard data
    }));

    res.json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get shop by ID (now supports name-platform format)
app.get('/api/shops/:shopId', async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        scans: {
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

// New endpoint to get shop by name and platform
app.get('/api/shops/lookup/:name/:platform', async (req, res) => {
  const { name, platform } = req.params;
  const shopId = `${name.toLowerCase()}-${platform.toLowerCase()}`;

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        scans: true,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch shop data' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});