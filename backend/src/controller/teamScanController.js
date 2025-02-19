const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllTeamScans = async (req, res) => {
  try {
    const teamScans = await prisma.teamScan.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json({
      success: true,
      teamScans,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: 'Failed to fetch team scans' });
  }
};

const createTeamScan = async (req, res) => {
  const { teamId, phoneNumber, agentName } = req.body;

  if (!teamId || !phoneNumber || !agentName) {
    return res.status(400).json({ error: 'Missing teamId, phoneNumber or agentName' });
  }

  try {
    const existingTeamScan = await prisma.teamScan.findFirst({
      where: {
        AND: [{ teamId }, { phoneNumber }],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingTeamScan) {
      const lastScanTime = new Date(existingTeamScan.createdAt);
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

    const teamScan = await prisma.teamScan.create({
      data: {
        teamId,
        phoneNumber,
        agentName,
        status: 'completed',
      },
    });

    res.json({
      success: true,
      message: 'Team scan recorded successfully',
      teamScan,
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({ error: 'Failed to record team scan' });
  }
};

const deleteAllTeamScans = async (req, res) => {
  try {
    await prisma.teamScan.deleteMany();
    res.json({ success: true, message: 'All team scans deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: 'Failed to delete team scans' });
  }
};

module.exports = { getAllTeamScans, createTeamScan, deleteAllTeamScans };
