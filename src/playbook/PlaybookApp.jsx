// src/playbook/PlaybookApp.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import SidePanelInspector from './components/SidePanelInspector.jsx';
import OverviewView from './components/views/OverviewView.jsx';
import EvidenceLibrary from './components/views/EvidenceLibrary.jsx';
import InsightCardsView from './components/views/InsightCardsView.jsx';
import SystemMapsView from './components/views/SystemMapsView.jsx';
import TensionExplorer from './components/views/TensionExplorer.jsx';
import DecisionExplorer from './components/views/DecisionExplorer.jsx';
import TransitionExplorer from './components/views/TransitionExplorer.jsx';
import ScenarioLab from './components/views/ScenarioLab.jsx';
import OpportunityBuilder from './components/views/OpportunityBuilder.jsx';
import BrandMatrixView from './components/views/BrandMatrixView.jsx';
import AIAssistantView from './components/views/AIAssistantView.jsx';
import AdminView from './components/views/AdminView.jsx';
import EditModal from './components/admin/EditModal.jsx';
import ExportShareModal from './components/shared/ExportShareModal.jsx';
import MetaAdminAuthModal from '../components/admin/MetaAdminAuthModal.jsx';
import MetaAdminCMSModal from '../components/admin/MetaAdminCMSModal.jsx';
import { PlaybookDataProvider } from './context/PlaybookDataContext.jsx';
import { mapEntityToScenario } from './engine/scenarioBridge.js';
import { mapEntityToAIOperation } from './engine/aiBridge.js';
import { usePlaybookData } from './context/usePlaybookData.js';

export default function PlaybookApp({ onBackToPortal }) {
  return (
    <PlaybookDataProvider>
      <PlaybookAppInner onBackToPortal={onBackToPortal} />
    </PlaybookDataProvider>
  );
}

function PlaybookAppInner({ onBackToPortal }) {
  const [currentView, setCurrentView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedEpistemic, setSelectedEpistemic] = useState('ALL');
  const [inspectedEntity, setInspectedEntity] = useState(null);
  const [activeInsightId, setActiveInsightId] = useState(null);
  const [isExportShareOpen, setIsExportShareOpen] = useState(false);
  const [incomingScenario, setIncomingScenario] = useState(null);
  const [incomingAIEntity, setIncomingAIEntity] = useState(null);
  const [incomingOppDraft, setIncomingOppDraft] = useState(null);
  const { data } = usePlaybookData();

  const handleInspectEntity = (entity) => {
    setInspectedEntity(entity);
  };

  const handleCloseInspector = () => {
    setInspectedEntity(null);
  };

  const handleSimulateEntity = (entity) => {
    const mapped = mapEntityToScenario(entity);
    setIncomingScenario(mapped);
    setCurrentView('scenario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearIncomingScenario = () => {
    setIncomingScenario(null);
  };

  const handleBuildOpportunity = (oppData, scenarioState) => {
    setIncomingOppDraft({
      ...oppData,
      scenarioState
    });
    setCurrentView('opportunities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearIncomingOppDraft = () => {
    setIncomingOppDraft(null);
  };

  const handleAnalyzeWithAI = (entity) => {
    const mapped = mapEntityToAIOperation(entity, data);
    setIncomingAIEntity(mapped);
    setCurrentView('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearIncomingAIEntity = () => {
    setIncomingAIEntity(null);
  };

  const handleSelectInsight = (insightId) => {
    setActiveInsightId(insightId);
    setCurrentView('insights');
  };

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8F9FA',
        color: '#191919',
        fontFamily: "'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Membrete Oficial Provokers exclusivo para Impresión / PDF */}
      <div className="print-only-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#191919', letterSpacing: '-0.02em' }}>
              PROVOKERS <span style={{ color: '#F6911E' }}>INSIGHT PLAYBOOK</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Proyecto: Inmersiones en Hogar CDMX · Estudio Lullaby 2026
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748B' }}>
            <div>Documento de Consulta Estratégica</div>
            <div style={{ fontWeight: 700, color: '#191919' }}>Generado el: {new Date().toLocaleDateString('es-MX')}</div>
          </div>
        </div>
      </div>

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onSelectView={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        selectedEpistemic={selectedEpistemic}
        onSelectEpistemic={setSelectedEpistemic}
        onBackToPortal={onBackToPortal}
        onOpenExportShare={() => setIsExportShareOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ minHeight: 'calc(100vh - 120px)', paddingBottom: '3rem' }}>
        {currentView === 'overview' && (
          <OverviewView
            onNavigate={handleNavigate}
            onInspectEntity={handleInspectEntity}
          />
        )}

        {currentView === 'evidence' && (
          <EvidenceLibrary
            onInspectEntity={handleInspectEntity}
            onSelectInsight={handleSelectInsight}
            searchQuery={searchQuery}
            selectedBrand={selectedBrand}
            selectedEpistemic={selectedEpistemic}
          />
        )}

        {currentView === 'insights' && (
          <InsightCardsView
            onInspectEntity={handleInspectEntity}
            onNavigateToView={handleNavigate}
            onSimulateEntity={handleSimulateEntity}
            searchQuery={searchQuery}
            selectedBrand={selectedBrand}
            selectedEpistemic={selectedEpistemic}
            activeInsightId={activeInsightId}
          />
        )}

        {currentView === 'system-map' && (
          <SystemMapsView
            onInspectEntity={handleInspectEntity}
            onSimulateEntity={handleSimulateEntity}
          />
        )}

        {currentView === 'tensions' && (
          <TensionExplorer
            onInspectEntity={handleInspectEntity}
            onSimulateEntity={handleSimulateEntity}
          />
        )}

        {currentView === 'decisions' && (
          <DecisionExplorer
            onInspectEntity={handleInspectEntity}
          />
        )}

        {currentView === 'transitions' && (
          <TransitionExplorer
            onInspectEntity={handleInspectEntity}
            onNavigateToView={handleNavigate}
          />
        )}

        {currentView === 'scenario' && (
          <ScenarioLab
            onNavigateToView={handleNavigate}
            incomingScenario={incomingScenario}
            onClearIncomingScenario={handleClearIncomingScenario}
            onBuildOpportunity={handleBuildOpportunity}
          />
        )}

        {currentView === 'opportunities' && (
          <OpportunityBuilder
            onInspectEntity={handleInspectEntity}
            incomingOppDraft={incomingOppDraft}
            onClearIncomingOppDraft={handleClearIncomingOppDraft}
            onSimulateContext={handleSimulateEntity}
          />
        )}

        {currentView === 'matrix' && (
          <BrandMatrixView
            onInspectEntity={handleInspectEntity}
          />
        )}

        {currentView === 'ai' && (
          <AIAssistantView
            onInspectEntity={handleInspectEntity}
            incomingEntity={incomingAIEntity}
            onClearIncomingEntity={handleClearIncomingAIEntity}
          />
        )}

        {currentView === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Sliding Side Panel Inspector */}
      {inspectedEntity && (
        <SidePanelInspector
          item={inspectedEntity}
          onClose={handleCloseInspector}
          onNavigateToView={handleNavigate}
          onSimulateEntity={handleSimulateEntity}
          onAnalyzeWithAI={handleAnalyzeWithAI}
        />
      )}

      {/* Global Universal Content Edit Modal */}
      <EditModal />

      {/* Export & Share Modal */}
      <ExportShareModal
        isOpen={isExportShareOpen}
        onClose={() => setIsExportShareOpen(false)}
        currentView={currentView}
      />

      {/* Meta Admin Structural CMS & Auth Modals */}
      <MetaAdminAuthModal />
      <MetaAdminCMSModal />
    </div>
  );
}
