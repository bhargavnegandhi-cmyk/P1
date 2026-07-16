// ============================================================
// Diagnostics — persistent per-concept quiz performance tracking
// Shared across the Final Review quiz and the Readiness Dashboard.
// Stored in localStorage under 'cfa-quant-diagnostics'.
// Shape: { "<concept name>": { cat: "...", correct: N, attempts: N, lastCorrect: bool, lastAt: ISOdate } }
// ============================================================

const CFA_DIAGNOSTICS_KEY = 'cfa-quant-diagnostics';

function cfaLoadDiagnostics(){
  try {
    const raw = localStorage.getItem(CFA_DIAGNOSTICS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e){
    return {};
  }
}

function cfaSaveDiagnostics(data){
  try { localStorage.setItem(CFA_DIAGNOSTICS_KEY, JSON.stringify(data)); } catch(e){}
}

// Record one answered question's result against a specific concept.
function cfaRecordAnswer(concept, cat, isCorrect){
  const data = cfaLoadDiagnostics();
  if (!data[concept]) data[concept] = { cat, correct: 0, attempts: 0, lastCorrect: null, lastAt: null };
  data[concept].cat = cat; // keep current in case categories were renamed
  data[concept].attempts += 1;
  if (isCorrect) data[concept].correct += 1;
  data[concept].lastCorrect = isCorrect;
  data[concept].lastAt = new Date().toISOString();
  cfaSaveDiagnostics(data);
}

// Clear all stored diagnostics (used by a "reset" control on the dashboard).
function cfaResetDiagnostics(){
  try { localStorage.removeItem(CFA_DIAGNOSTICS_KEY); } catch(e){}
}
