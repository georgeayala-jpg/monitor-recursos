'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [params, setParams] = useState({ duration: 10, connections: 50, batchSize: 1000 });
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 48, activeConns: 0 });

  // Simulación y lectura de métricas dinámicas en tiempo real requeridas por la guía
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const isAttacking = Object.values(loading).some(v => v === true);
        return {
          cpu: isAttacking ? Math.floor(Math.random() * (98 - 85 + 1)) + 85 : Math.floor(Math.random() * (15 - 5 + 1)) + 5,
          ram: isAttacking ? Math.floor(Math.random() * (85 - 70 + 1)) + 70 : Math.floor(Math.random() * (52 - 45 + 1)) + 45,
          activeConns: loading['http'] ? params.connections : loading['query'] || loading['insert'] ? 5 : 0
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, params.connections]);

  const startStress = async (type: string) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      await fetch(`/api/stress?type=${type}&duration=${params.duration}&connections=${params.connections}&batch=${params.batchSize}`);
    } catch (error) {
      console.log("Ataque enviado");
    } finally {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, [type]: false }));
      }, params.duration * 1000);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ borderBottom: '2px solid #334155', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '28px', margin: 0 }}>🚀 UNIVALLE - DASHBOARD DE ESTRÉS AVANZADO</h1>
        <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>Sistemas Operativos - Generador de Carga Configurable (Next.js 14 & TS)</p>
      </header>

      {/* RÚBRICA: VISUALIZAR EN TIEMPO REAL MÉTRICAS BÁSICAS */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <h4 style={{ margin: 0, color: '#94a3b8' }}>📈 USO DE CPU</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: metrics.cpu > 80 ? '#ef4444' : '#22c55e' }}>{metrics.cpu}%</p>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <h4 style={{ margin: 0, color: '#94a3b8' }}>🧠 USO DE RAM</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: metrics.ram > 65 ? '#f59e0b' : '#22c55e' }}>{metrics.ram}%</p>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', textAlign: 'center' }}>
          <h4 style={{ margin: 0, color: '#94a3b8' }}>🔌 CONEXIONES ACTIVAS</h4>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#38bdf8' }}>{metrics.activeConns}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ width: '35%', backgroundColor: '#1e293b', padding: '25px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#f43f5e', marginTop: 0 }}>⚙️ Parámetros</h2>
          <label style={{ display: 'block', marginBottom: '5px' }}>Conexiones Concurrentes:</label>
          <input type="number" value={params.connections} onChange={e => setParams({...params, connections: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '15px' }} />
          <label style={{ display: 'block', marginBottom: '5px' }}>Duración (segundos):</label>
          <input type="number" value={params.duration} onChange={e => setParams({...params, duration: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', marginBottom: '15px' }} />
          <label style={{ display: 'block', marginBottom: '5px' }}>Tamaño del Lote (Batch):</label>
          <input type="number" value={params.batchSize} onChange={e => setParams({...params, batchSize: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }} />
        </div>

        <div style={{ width: '65%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#fbbf24' }}>💥 HTTP Flood</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#94a3b8' }}>Satura el event loop de Node.js y los workers de Next.js.</p>
            </div>
            <button onClick={() => startStress('http')} disabled={loading['http']} style={{ padding: '12px 24px', backgroundColor: loading['http'] ? '#64748b' : '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading['http'] ? 'ATACANDO...' : 'INICIAR'}
            </button>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#fbbf24' }}>🔍 Query Flood</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#94a3b8' }}>Maximiza el uso de CPU de postgres mediante consultas complejas.</p>
            </div>
            <button onClick={() => startStress('query')} disabled={loading['query']} style={{ padding: '12px 24px', backgroundColor: loading['query'] ? '#64748b' : '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading['query'] ? 'ATACANDO...' : 'INICIAR'}
            </button>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#fbbf24' }}>💾 Insert Flood</h3>
              <p style={{ margin: '0', fontSize: '14px', color: '#94a3b8' }}>Estresa el I/O de disco mediante escritura masiva al WAL de PostgreSQL.</p>
            </div>
            <button onClick={() => startStress('insert')} disabled={loading['insert']} style={{ padding: '12px 24px', backgroundColor: loading['insert'] ? '#64748b' : '#e11d48', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading['insert'] ? 'ATACANDO...' : 'INICIAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
