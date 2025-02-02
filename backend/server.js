const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Get scan data for all shops
app.get('/api/scans', async (req, res) => {
  try {
    // Get all shops with their scans
    const shopsWithScans = await prisma.shop.findMany({
      include: {
        scans: {
          select: {
            phoneNumber: true,
          },
        },
      },
    });

    // Transform the data into the desired format
    const result = shopsWithScans.reduce((acc, shop) => {
      acc[shop.id] = {
        count: shop.scans.length,
        phoneNumbers: [...new Set(shop.scans.map(scan => scan.phoneNumber))], // Remove duplicates
        name: shop.name,
        platform: shop.platform,
        url: shop.url
      };
      return acc;
    }, {});

    res.json(result);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Failed to fetch scan data' });
  }
});

// // Record new scan

app.post('/api/scans', async (req, res) => {
  const { shopId, phoneNumber } = req.body;

  if (!shopId || !phoneNumber) {
    return res.status(400).json({ error: 'Missing shopId or phoneNumber' });
  }

  try {
    // Check for existing scan
    const existingScan = await prisma.scan.findFirst({
      where: {
        AND: [
          { shopId },
          { phoneNumber }
        ]
      },
      include: {
        shop: {
          select: {
            name: true
          }
        }
      }
    });

    if (existingScan) {
      const shopName = existingScan.shop.name;
      return res.json({
        success: false,
        message: `This phone number has already been used to scan the ${shopName} shop`
      });
    }

    // Create new scan
    const scan = await prisma.scan.create({
      data: {
        shopId,
        phoneNumber,
        status: 'completed'
      }
    });

    res.json({
      success: true,
      message: 'Scan recorded successfully',
      scan
    });

  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: 'Failed to record scan' });
  }
});



// Delete all scans
app.delete('/api/scans', async (req, res) => {
  try {
    await prisma.scan.deleteMany();
    res.json({ success: true, message: 'All scans deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: 'Failed to delete scans' });
  }
});

const PORT = process.env.PORT || 5000;

// Initialize Prisma and start server
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle cleanup
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});