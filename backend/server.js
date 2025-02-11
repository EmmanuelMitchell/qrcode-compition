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
    const scans = await prisma.scan.findMany({
      orderBy: {
        createdAt: 'desc', // Newest scans appear first
      },
    });

    res.json({
      success: true,
      scans,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
});

app.post('/api/scans', async (req, res) => {
  const { shopId, phoneNumber } = req.body;
  console.log("Server waiting", req.body);

  if (!shopId || !phoneNumber) {
    return res.status(400).json({ error: 'Missing shopId or phoneNumber' });
  }

  try {
    // Get the most recent scan for this shop and phone number
    const existingScan = await prisma.scan.findFirst({
      where: {
        AND: [{ shopId }, { phoneNumber }]
      },
      orderBy: { createdAt: 'desc' } // Order by most recent first
    });

    if (existingScan) {
      const lastScanTime = new Date(existingScan.createdAt);
      const currentTime = new Date();
      const timeDifference = (currentTime - lastScanTime) / (1000 * 60); // Convert to minutes

      if (timeDifference < 60) {
        const remainingMinutes = Math.ceil(60 - timeDifference);
        return res.json({
          success: false,
          message: `You can scan again in ${remainingMinutes} minutes.`
        });
      }
    }

    // Create a new scan
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