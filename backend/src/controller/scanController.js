const { PrismaClient } = require("@prisma/client");

// const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllScans = async (req, res) => {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: {
        createdAt: 'desc',
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
};

const createScan = async (req, res) => {
  const { shopId, phoneNumber } = req.body;

  if (!shopId || !phoneNumber) {
    return res.status(400).json({ error: 'Missing shopId or phoneNumber' });
  }

  try {
    const existingScan = await prisma.scan.findFirst({
      where: {
        AND: [{ shopId }, { phoneNumber }],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingScan) {
      const lastScanTime = new Date(existingScan.createdAt);
      const currentTime = new Date();
      const timeDifference = (currentTime - lastScanTime) / (1000 * 60);

      if (timeDifference < 60) {
        const remainingMinutes = Math.ceil(60 - timeDifference);
        return res.json({
          success: false,
          message: `You can scan again in ${remainingMinutes} minutes.`,
        });
      }
    }

    const scan = await prisma.scan.create({
      data: {
        shopId,
        phoneNumber,
        status: 'completed',
      },
    });

    res.json({
      success: true,
      message: 'Scan recorded successfully',
      scan,
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: 'Failed to record scan' });
  }
};

const deleteAllScans = async (req, res) => {
  try {
    await prisma.scan.deleteMany();
    res.json({ success: true, message: 'All scans deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: 'Failed to delete scans' });
  }
};

module.exports = { getAllScans, createScan, deleteAllScans };
