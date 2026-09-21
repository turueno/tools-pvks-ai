import React, { useState } from 'react';
import { runSNTDDiagnostic, SNTD_GATEWAYS } from '../logic/salsaNegraEngine';
import { downloadJSON, generateTextReport, downloadText } from '../logic/utils/exportUtils';
import EditableText from './shared/EditableText.jsx';

const SalsaNegraDiagnostic = ({ documentoRector }) => {
    const [step, setStep] = useState(0); // 0: Config, 1: Inputs, 2: Results
    const [priorities, setPriorities] = useState([5, 5, 9, 3, 5, 5, 5]);
    const [inputs, setInputs] = useState({
        prototipo: 'Salsa Negra "Fuego Extremo"',
        fichaSensorial: 'Entrada muy picante que opaca el resto de sabores. Se percibe un retrogusto a limón artificial (ácido cítrico industrial) muy marcado. El sabor es plano, no se siente construcción en capas, solo sal y picor.',
        visual: 'Empaque de plástico flexible, color rojo y naranja vibrante. Tipografía tipo grafiti moderna.'
    });
    const [config, setConfig] = useState({
        apiKey: '',
        model: 'openai/gpt-4o-mini'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handlePriorityChange = (index, value) => {
        const newPriorities = [...priorities];
        newPriorities[index] = parseInt(value);
        setPriorities(newPriorities);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const resetAll = () => {
        setStep(0);
        setPriorities([5, 5, 9, 3, 5, 5, 5]);
        setInputs({
            prototipo: '',
            fichaSensorial: '',
            visual: ''
        });
        setResult(null);
        setError(null);
        setProgress(0);
    };

    const handleDownloadReport = (format) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `SNTD_${inputs.prototipo.replace(/\s+/g, '_')}_${timestamp}`;

        if (format === 'json') {
            downloadJSON({ inputs, priorities, result, date: new Date().toISOString() }, filename);
        } else {
            const report = generateTextReport(result, inputs, priorities, SNTD_GATEWAYS);
            downloadText(report, filename);
        }
    };

    const executeDiagnostic = async () => {
        if (!config.apiKey) {
            setError("Se requiere API Key de OpenRouter para la Alquimia Territorial.");
            setStep(0);
            return;
        }
        setError(null);
        setLoading(true);
        setProgress(0);

        // Simulation of progress for ritualistic effect
        const timer = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 90));
        }, 800);

        try {
            const diagResult = await runSNTDDiagnostic(inputs, priorities, documentoRector, config);
            clearInterval(timer);
            setProgress(100);
            setTimeout(() => {
                setResult(diagResult);
                setStep(2);
            }, 500);
        } catch (err) {
            clearInterval(timer);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel ritual-enter" style={{ marginTop: '3rem', border: '1px solid rgba(255, 206, 0, 0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }}></div>

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="sntd-accent" style={{ margin: 0, fontSize: '1.8rem' }}>
                        <EditableText dictKey="sntd.header.title" defaultText="MÓDULO S.N.T.D." />
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <EditableText dictKey="sntd.header.desc" defaultText="Salsa Negra Territory Diagnostic | AI-Agent v1.2" />
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge" style={{ background: 'rgba(255,206,0,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>PROTOCOL: BPMN-X7</span>
                    <span className="badge" style={{ background: 'rgba(255,206,0,0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>OPENAI/GOOGLE</span>
                </div>
            </header>

            {error && (
                <div className="ritual-enter" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: '#F87171', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                    <strong>ALERTA:</strong> {error}
                </div>
            )}

            {step === 0 && (
                <div className="ritual-enter">
                    <h3 style={{ marginBottom: '1rem', color: '#191919' }}>Paso 1: Configuración de Escucha Territorial</h3>

                    <div className="glass-panel" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label>🔑 API Key (OpenRouter)</label>
                                <input type="password" name="apiKey" value={config.apiKey} onChange={handleConfigChange} placeholder="sk-or-v1-..." />
                            </div>
                            <div>
                                <label>🤖 Modelo Predictivo</label>
                                <select name="model" value={config.model} onChange={handleConfigChange}>
                                    <option value="openai/gpt-4o-mini">GPT-4o mini (Equilibrado)</option>
                                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Sensorial/Narrativo)</option>
                                    <option value="google/gemini-2.0-flash">Gemini 2.0 Flash (Velocidad Directa)</option>
                                    <option value="google/gemini-1.5-pro">Gemini 1.5 Pro (Análisis Profundo)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <label style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '1rem' }}>PONDERACIÓN AHP (0-9)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                        {Object.keys(SNTD_GATEWAYS).map((key, index) => (
                            <div key={key} className="glass-panel" style={{ padding: '0.9rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold', color: '#191919' }}>{SNTD_GATEWAYS[key].name}</span>
                                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>[{priorities[index]}]</span>
                                </div>
                                <input type="range" min="1" max="9" value={priorities[index]} onChange={(e) => handlePriorityChange(index, e.target.value)} />
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Tipo: {SNTD_GATEWAYS[key].type}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setStep(1)} className="primary-button" style={{ width: '100%', marginTop: '2rem', height: '3.5rem', fontSize: '1.05rem', fontWeight: 800 }}>Establecer Criterios</button>
                </div>
            )}

            {step === 1 && (
                <div className="ritual-enter">
                    <h3 style={{ marginBottom: '1rem' }}>Paso 2: Ingesta de Inputs del Prototipo</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Nombre del Prototipo</label>
                            <input name="prototipo" value={inputs.prototipo} onChange={handleInputChange} style={{ fontSize: '1.2rem', padding: '1rem' }} />

                            <label>Contexto Visual / Packaging</label>
                            <textarea name="visual" value={inputs.visual} onChange={handleInputChange} rows="5" placeholder="¿Cómo se ve?" />
                        </div>
                        <div>
                            <label>Ficha Sensorial (Cata)</label>
                            <textarea name="fichaSensorial" value={inputs.fichaSensorial} onChange={handleInputChange} rows="9" placeholder="Describe la experiencia de cata..." />
                        </div>
                    </div>

                    {loading && (
                        <div style={{ marginTop: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span>Agente SNTD analizando compuertas territoriales...</span>
                                <span>{progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div className="progress-bar-inner" style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)' }}></div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button onClick={() => setStep(0)} style={{ flex: 1, background: 'transparent', border: '1px solid var(--text-muted)' }}>Regresar</button>
                        <button onClick={executeDiagnostic} disabled={loading} style={{ flex: 2, background: 'var(--accent)', height: '4rem', fontSize: '1.2rem' }}>
                            {loading ? 'ANALIZANDO...' : 'INICIAR EXTRACCIÓN TERRITORIAL'}
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && result && (
                <div className="ritual-enter">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
                        {/* Final Report Column */}
                        <div className="glass-panel" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1 style={{ margin: 0, fontSize: '3rem', color: 'var(--accent)' }}>{result.dictamen}</h1>
                                <p style={{ color: 'var(--text-muted)' }}>DICTAMEN FINAL TERRITORIAL</p>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem', color: '#191919' }}>{(result.totalScore * 100).toFixed(1)}% Alignment</div>
                            </div>

                            <div style={{ marginTop: '3rem' }}>
                                <h3 style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', color: '#191919' }}>MAPA DE OPORTUNIDADES</h3>

                                {result.aoClassification.Criticas.length > 0 && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h4 style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
                                            ÁREAS CRÍTICAS (DEAL-BREAKERS)
                                        </h4>
                                        {result.aoClassification.Criticas.map((ao, i) => (
                                            <div key={i} className="glass-panel ao-critical" style={{ marginTop: '0.8rem', padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <strong>{ao.gateway}</strong>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--danger)' }}>TYPE: {ao.type}</span>
                                                </div>
                                                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#191919' }}><strong>Area de Oportunidad Clave:</strong> {ao.ao}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>"{ao.rationale}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {result.aoClassification.Mejoras.length > 0 && (
                                    <div style={{ marginTop: '2rem' }}>
                                        <h4 style={{ color: 'var(--accent)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }}></span>
                                            OPORTUNIDADES DE ANCLAJE
                                        </h4>
                                        {result.aoClassification.Mejoras.map((ao, i) => (
                                            <div key={i} className="glass-panel ao-territorial" style={{ marginTop: '0.8rem', padding: '1rem', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <strong>{ao.gateway}</strong>
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>TYPE: {ao.type}</span>
                                                </div>
                                                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#191919' }}><strong>Area de Oportunidad Clave:</strong> {ao.ao}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>"{ao.rationale}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {result.aoClassification.Criticas.length === 0 && result.aoClassification.Mejoras.length === 0 && (
                                    <div className="glass-panel" style={{ marginTop: '1.5rem', textAlign: 'center', border: '1px solid var(--secondary)', background: '#F0FDF4' }}>
                                        <p style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>¡Producto Territorialmente Sólido!</p>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>El agente no detectó desviaciones significativas respecto al Documento Rector.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visual Breakdown Column */}
                        <div>
                            <h3 style={{ color: '#191919' }}>PERFIL DEL RESULTADO</h3>
                            <div className="glass-panel" style={{ padding: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                {result.logs.map((log, i) => (
                                    <div key={i} style={{ marginBottom: '1.2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.4rem', color: '#191919' }}>
                                            <span>G{i + 1}: {SNTD_GATEWAYS[log.gateway].name}</span>
                                            <span style={{ fontWeight: 700, color: log.score >= 0.8 ? 'var(--secondary)' : log.score >= 0.5 ? 'var(--accent)' : 'var(--danger)' }}>
                                                Score: {(log.score * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${log.score * 100}%`, height: '100%', background: log.score >= 0.8 ? 'var(--secondary)' : log.score >= 0.5 ? 'var(--accent)' : 'var(--danger)' }}></div>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.3rem' }}>
                                            Impacto en Dictamen: {(log.weightedImpact * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="glass-panel" style={{ marginTop: '2rem', border: '1px dashed #CBD5E1', background: '#FFFFFF' }}>
                                <h4 style={{ color: '#191919' }}>Metodología AI-First</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    Este diagnóstico ha sido generado analizando el prototipo contra el Documento Rector mediante agentes de razonamiento profundo.
                                    Las ponderaciones AHP aseguran que la jerarquía de la acidez y la identidad territorial predominen sobre ajustes cosméticos.
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <button onClick={() => handleDownloadReport('text')} className="primary-button" style={{ fontWeight: 'bold' }}>
                                        DESCARGAR TXT
                                    </button>
                                    <button onClick={() => handleDownloadReport('json')} className="secondary-button" style={{ fontWeight: 'bold', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                                        DESCARGAR DATA
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <button onClick={() => setStep(1)} className="secondary-button" style={{ fontWeight: 'bold', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                                        AJUSTAR INPUTS
                                    </button>
                                    <button onClick={() => setStep(0)} className="secondary-button" style={{ fontWeight: 'bold', borderColor: '#94A3B8', color: '#64748B' }}>
                                        REVISAR AHP
                                    </button>
                                </div>
                                <button onClick={resetAll} style={{ width: '100%', background: '#FEF2F2', border: '1px solid #FECACA', color: 'var(--danger)', fontSize: '0.88rem', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600 }}>
                                    NUEVA SESIÓN (BORRAR TODO)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalsaNegraDiagnostic;
