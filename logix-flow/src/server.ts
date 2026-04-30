import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

<<<<<<< HEAD
// ===============================
// PRISMA SINGLETON (PROD SAFE)
// ===============================
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

const app = express();
=======
const app = express();

// Prisma (produção segura)
const prisma = new PrismaClient({
  log: ['error']
});
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// ===============================
// HEALTH CHECK
// ===============================
app.get('/health', (_, res) => {
=======
// ==========================================
// ❤️ HEALTH CHECK (OBRIGATÓRIO FLY)
// ==========================================
app.get('/health', (req, res) => {
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
  res.json({
    status: 'ok',
    service: 'logix-flow',
    timestamp: new Date().toISOString()
  });
});

<<<<<<< HEAD
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
      include: { driver: true, vehicle: true },
      orderBy: { id: 'desc' }
    });

    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar viagens' });
=======
// ==========================================
// 🚛 VEÍCULOS
// ==========================================
app.get('/veiculos', async (req, res) => {
  try {
    const veiculos = await prisma.vehicles.findMany({
      orderBy: { id: 'desc' }
    });
    res.json(veiculos);
  } catch {
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

// ==========================================
// 👨‍💼 MOTORISTAS
// ==========================================
app.get('/drivers', async (req, res) => {
  try {
    const drivers = await prisma.drivers.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(drivers);
  } catch {
    res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
});

// ==========================================
// 🛣️ VIAGENS
// ==========================================
app.get('/trips', async (req, res) => {
  try {
    const trips = await prisma.trips.findMany({
      include: {
        driver: true,
        vehicle: true
      },
      orderBy: { id: 'desc' }
    });

    res.json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
  }
});

app.post('/trips', async (req, res) => {
  const { origin, destination, driver_id, vehicle_id } = req.body;

  try {
    const trip = await prisma.$transaction(async (tx) => {
      const created = await tx.trips.create({
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

      return created;
    });

<<<<<<< HEAD
    res.status(201).json(trip);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
=======
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
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

<<<<<<< HEAD
      if (!trip) throw new Error('Viagem não encontrada');
=======
      if (!trip) throw new Error("Viagem não encontrada");
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)

      const updated = await tx.trips.update({
        where: { id: Number(id) },
        data: {
          status: 'COMPLETED',
          end_at: new Date()
        }
      });

      if (trip.driver_id) {
        await tx.drivers.update({
<<<<<<< HEAD
          where: { id: Number(trip.driver_id) },
=======
          where: { id: trip.driver_id },
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
          data: { status: 'ACTIVE' }
        });
      }

      if (trip.vehicle_id) {
        await tx.vehicles.update({
<<<<<<< HEAD
          where: { id: Number(trip.vehicle_id) },
=======
          where: { id: trip.vehicle_id },
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
          data: {
            status: 'AVAILABLE',
            current_km: Number(end_km)
          }
        });
      }

      return updated;
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

<<<<<<< HEAD
// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;
=======
// ==========================================
// 🚀 SERVER (PRODUÇÃO FLY SAFE)
// ==========================================
const PORT = Number(process.env.PORT) || 3000;
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Logix Flow rodando na porta ${PORT}`);
});

<<<<<<< HEAD
// ===============================
// SHUTDOWN LIMPO (FLY SAFE)
// ===============================
process.on('SIGTERM', async () => {
  console.log('🧹 Encerrando servidor...');
  await prisma.$disconnect();

  server.close(() => {
    console.log('✅ Servidor encerrado');
  });
});

// ===============================
// ERROR HANDLERS
// ===============================
process.on('unhandledRejection', (err) => {
  console.error('🔥 UNHANDLED REJECTION:', err);
});

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});
=======
// ==========================================
// 🧹 SHUTDOWN LIMPO (IMPORTANTE FLY)
// ==========================================
process.on('SIGTERM', async () => {
  console.log('🧹 Encerrando servidor...');

  await prisma.$disconnect();

  server.close(() => {
    console.log('✅ Servidor encerrado com segurança');
  });
});
>>>>>>> 42f13e8 (fix: remove dist from repository and clean production setup)
