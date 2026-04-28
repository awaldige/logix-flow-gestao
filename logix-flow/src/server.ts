import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors()); 
app.use(express.json());

// ==========================================
// 🚛 ROTAS DE VEÍCULOS
// ==========================================
app.get('/veiculos', async (req, res) => {
  try {
    const veiculos = await prisma.vehicles.findMany({ 
      orderBy: { id: 'desc' } 
    });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

// ==========================================
// 👨‍💼 ROTAS DE MOTORISTAS
// ==========================================
app.get('/drivers', async (req, res) => {
  try {
    const drivers = await prisma.drivers.findMany({ 
      orderBy: { name: 'asc' } 
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
});

// ==========================================
// 🛣️ ROTAS DE VIAGENS
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
    console.error("ERRO NO BACKEND:", error.message);
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
          start_at: new Date(), 
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
      const tripOriginal = await tx.trips.findUnique({ where: { id: Number(id) } });
      if (!tripOriginal) throw new Error("Viagem não encontrada");
      
      const tripUpdated = await tx.trips.update({
        where: { id: Number(id) },
        data: { status: 'COMPLETED', end_at: new Date() }
      });

      if (tripOriginal.driver_id) {
        await tx.drivers.update({ 
          where: { id: Number(tripOriginal.driver_id) }, 
          data: { status: 'ACTIVE' } 
        });
      }
      if (tripOriginal.vehicle_id) {
        await tx.vehicles.update({ 
          where: { id: Number(tripOriginal.vehicle_id) }, 
          data: { status: 'AVAILABLE', current_km: Number(end_km) } 
        });
      }
      return tripUpdated;
    });
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ALTERAÇÃO: Mudei para a porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Logix Flow Backend rodando em http://localhost:${PORT}`);
});