import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();

/**
 * Prisma Singleton (evita múltiplas conexões em dev)
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

app.use(cors());
app.use(express.json());

// ===============================
// HEALTH CHECK
// ===============================
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    service: 'logix-flow',
    timestamp: new Date().toISOString()
  });
});

// ===============================
// VEÍCULOS
// ===============================
app.get('/veiculos', async (_, res) => {
  try {
    const data = await prisma.vehicles.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar veículos' });
  }
});

// ===============================
// MOTORISTAS
// ===============================
app.get('/drivers', async (_, res) => {
  try {
    const data = await prisma.drivers.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar motoristas' });
  }
});

// ===============================
// VIAGENS
// ===============================
app.get('/trips', async (_, res) => {
  try {
    const data = await prisma.trips.findMany({
      include: {
        driver: true,
        vehicle: true
      },
      orderBy: { id: 'desc' }
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/trips', async (req, res) => {
  const { origin, destination, driver_id, vehicle_id } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trips.create({
        data: {
          origin_address: origin,
          destination_address: destination,
          driver_id: Number(driver_id),
          vehicle_id: Number(vehicle_id),
          status: 'ONGOING',
          start_at: new Date()
        }
      });

      await tx.drivers.update({
        where: { id: Number(driver_id) },
        data: { status: 'IN_TRIP' }
      });

      await tx.vehicles.update({
        where: { id: Number(vehicle_id) },
        data: { status: 'MAINTENANCE' }
      });

      return trip;
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/trips/:id/finish', async (req, res) => {
  const { id } = req.params;
  const { end_km } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const trip = await tx.trips.findUnique({
        where: { id: Number(id) }
      });

      if (!trip) throw new Error('Viagem não encontrada');

      const updated = await tx.trips.update({
        where: { id: Number(id) },
        data: {
          status: 'COMPLETED',
          end_at: new Date()
        }
      });

      if (trip.driver_id) {
        await tx.drivers.update({
          where: { id: trip.driver_id },
          data: { status: 'ACTIVE' }
        });
      }

      if (trip.vehicle_id) {
        await tx.vehicles.update({
          where: { id: trip.vehicle_id },
          data: {
            status: 'AVAILABLE',
            current_km: Number(end_km)
          }
        });
      }

      return updated;
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ===============================
// SERVER
// ===============================
const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Logix Flow rodando na porta ${PORT}`);
});

// ===============================
// SHUTDOWN LIMPO
// ===============================
process.on('SIGTERM', async () => {
  console.log('🧹 Encerrando servidor...');

  await prisma.$disconnect();

  server.close(() => {
    console.log('✅ Servidor encerrado');
  });
});