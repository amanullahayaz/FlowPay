import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Cpu, 
  Activity, 
  Database, 
  Lock,
  Sparkles,
  Server
} from 'lucide-react';

interface SystemHealth {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  components: {
    database: string;
    cache: string;
    eventBroker: string;
  };
}

export default function App() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API health check error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-[#0f1420]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                FlowPay
              </span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                DISTRIBUTED ENGINE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>System Operational</span>
            </div>
            <a 
              href="http://localhost:3000/api/docs" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Swagger API Docs</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Banner Hero */}
        <div className="relative overflow-hidden rounded-2xl glass-panel p-8 border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Fintech Architecture</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-serif">
              AI-Powered Banking & Double-Entry Ledger Engine
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              FlowPay implements double-entry accounting principles (∑ Debits = ∑ Credits), multi-layer concurrency control (Redis Redlock + Postgres Pessimistic Locks), transactional outbox streaming over Kafka, and real-time Gemini AI risk scoring.
            </p>
          </div>
        </div>

        {/* Distributed Architecture Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Postgres Database */}
          <div className="glass-panel glass-panel-hover p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Database className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                PostgreSQL 15
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">ACID Ledger & JSONB</h3>
              <p className="text-xs text-slate-400 mt-1">
                Immutable ledger entry guarantees (∑ Debits = ∑ Credits) plus indexed GIN document storage for audit logs.
              </p>
            </div>
          </div>

          {/* Card 2: Redis Concurrency Shield */}
          <div className="glass-panel glass-panel-hover p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                Redis 7 Redlock
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Idempotency Shield</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sub-millisecond sliding window rate limits, atomic idempotency keys, and Redlock distributed account locking.
              </p>
            </div>
          </div>

          {/* Card 3: Apache Kafka Broker */}
          <div className="glass-panel glass-panel-hover p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                Apache Kafka
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Transactional Outbox</h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero dual-write failures. Asynchronous event distribution, Saga compensation workflows, and Dead Letter Queues (DLQ).
              </p>
            </div>
          </div>
        </div>

        {/* Live Backend Telemetry Widget */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-lg text-white">Backend Health Diagnostics</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Endpoint: /api/v1/health</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-sm animate-pulse font-mono">
              Connecting to NestJS Distributed API Engine...
            </div>
          ) : health ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="text-slate-400">Service Name:</div>
                <div className="text-blue-400 font-semibold">{health.service}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="text-slate-400">Status & Environment:</div>
                <div className="text-emerald-400 font-semibold">{health.status} ({health.environment})</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2 col-span-1 md:col-span-2">
                <div className="text-slate-400">Active Services Configuration:</div>
                <ul className="space-y-1 text-slate-300 mt-1">
                  <li>• <span className="text-slate-400">Database:</span> {health.components.database}</li>
                  <li>• <span className="text-slate-400">Cache/Lock:</span> {health.components.cache}</li>
                  <li>• <span className="text-slate-400">Event Stream:</span> {health.components.eventBroker}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-amber-400 text-xs font-mono">
              ⚠️ Backend API offline or starting up. Run <code className="bg-slate-800 px-2 py-0.5 rounded text-slate-200">npm run dev:api</code> to launch NestJS server.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        FlowPay Distributed Banking Platform • Built with NestJS, PostgreSQL, Redis, Apache Kafka & React
      </footer>
    </div>
  );
}
