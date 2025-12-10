// frontend/src/components/incidents/StrategyCard.jsx

const StrategyCard = ({ pilot }) => {
  const getRiskColor = (level) => {
    const colors = {
      CRITICAL: '#FF4444',
      HIGH: '#FF9944',
      MODERATE: '#FFDD44',
      LOW: '#44FF88'
    };
    return colors[level] || '#999';
  };

  const getRiskIcon = (level) => {
    const icons = {
      CRITICAL: '🔴',
      HIGH: '🟠',
      MODERATE: '🟡',
      LOW: '🟢'
    };
    return icons[level] || '⚪';
  };

  return (
    <div 
      className="strategy-card"
      style={{ borderLeft: `4px solid ${getRiskColor(pilot.risk_level)}` }}
    >
      <div className="card-header">
        <h3>
          {getRiskIcon(pilot.risk_level)} {pilot.pilot_name}
        </h3>
        <span className="team-badge">{pilot.team_name}</span>
      </div>

      <div className="risk-details">
        <div className="risk-level">
          <span className="label">Niveau de risque:</span>
          <span 
            className="value"
            style={{ color: getRiskColor(pilot.risk_level) }}
          >
            {pilot.risk_level}
          </span>
        </div>

        <div className="risk-breakdown">
          <div className="risk-item">
            <span>Collision:</span>
            <strong>{(pilot.risks.collision * 100).toFixed(1)}%</strong>
          </div>
          <div className="risk-item">
            <span>Panne Moteur:</span>
            <strong>{(pilot.risks.panne_moteur * 100).toFixed(1)}%</strong>
          </div>
          <div className="risk-item">
            <span>Pneus:</span>
            <strong>{(pilot.risks.probleme_pneus * 100).toFixed(1)}%</strong>
          </div>
          <div className="risk-item">
            <span>Sortie Piste:</span>
            <strong>{(pilot.risks.sortie_piste * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div className="recommendation">
        <h4>💡 Recommandation</h4>
        <p>{pilot.recommendation}</p>
      </div>
    </div>
  );
};

export default StrategyCard;