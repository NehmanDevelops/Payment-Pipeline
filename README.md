# 💳 Payment Pipeline - Real-time Settlement Visualizer

A visually stunning, real-time visualization of how payments flow through a banking system — from initiation through fraud detection, balance verification, and final settlement.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?style=flat-square&logo=framer)

## 🎯 What This Demonstrates

This project showcases understanding of **enterprise payment infrastructure** concepts that banks like RBC use:

- **Transaction Pipeline Architecture** - Multi-stage processing with state management
- **Real-time Data Flow** - Animated visualization of concurrent transactions
- **Fraud Detection Integration** - ML-based risk scoring simulation
- **Error Handling & Retry Logic** - Failed transaction queue with retry mechanisms
- **Audit Trail Logging** - Complete transaction history with latency metrics
- **Settlement Processing** - Final clearing stage visualization

## ✨ Features

### 🔄 Live Transaction Pipeline
Watch transactions flow through 5 stages in real-time:
1. **Initiated** → Transaction received
2. **Fraud Check** → ML risk scoring (failures if score > 75)
3. **Balance Verify** → Account validation
4. **Processing** → Transaction execution
5. **Settlement** → Final clearing

### 📊 Real-time Metrics Dashboard
- Total transactions processed
- Success/failure rates
- Average processing latency
- Retry queue depth

### ⚡ Interactive Controls
- **Play/Pause** - Stop and resume the pipeline
- **Speed Control** - 0.5x to 4x simulation speed
- **Manual Transaction** - Add transactions on demand
- **Retry Failed** - Re-process failed transactions

### 🔍 Expandable Audit Trail
Click any transaction to see:
- Stage-by-stage processing history
- Latency at each step
- Failure reasons (if applicable)
- Risk score breakdown

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/NehmanDevelops/Payment-Pipeline.git

# Navigate to project
cd Payment-Pipeline

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   └── layout.tsx        # Root layout
├── components/
│   ├── PipelineVisualizer.tsx   # Animated pipeline stages
│   ├── TransactionList.tsx      # Transaction cards with audit trail
│   ├── MetricsDashboard.tsx     # Real-time metrics
│   ├── ControlPanel.tsx         # Play/pause, speed controls
│   └── RetryQueue.tsx           # Failed transaction queue
├── context/
│   └── PipelineContext.tsx      # State management & transaction processing
├── lib/
│   └── transaction-generator.ts # Realistic transaction data generation
└── types/
    └── transaction.ts           # TypeScript interfaces
```

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Lucide React** | Beautiful icons |
| **React Context** | State management |

## 💡 Key Concepts Demonstrated

### For Banking/Fintech Recruiters:
- ✅ Understanding of payment processing pipelines
- ✅ Real-time state management patterns
- ✅ Error handling and retry mechanisms
- ✅ Transaction audit trail implementation
- ✅ Risk scoring integration concepts
- ✅ Clean, production-ready code architecture

### Technical Skills:
- Modern React patterns (hooks, context)
- TypeScript with strict typing
- CSS animations with Framer Motion
- Responsive design
- Component composition

## 📝 Future Enhancements

- [ ] WebSocket integration for true real-time updates
- [ ] Database persistence with Prisma
- [ ] Authentication with JWT
- [ ] API rate limiting simulation
- [ ] More detailed ML fraud scoring
- [ ] Transaction search and filtering

## 👨‍💻 Author

**Nehman Karimi**

- Portfolio: [nehmans-portfolio.vercel.app](https://nehmans-portfolio.vercel.app)
- GitHub: [@NehmanDevelops](https://github.com/NehmanDevelops)
- LinkedIn: [/in/nehmankarimi](https://linkedin.com/in/nehmankarimi)

---

Built with ❤️ to demonstrate enterprise payment infrastructure concepts.
