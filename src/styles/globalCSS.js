/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS  (injected once into <head>)
═══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
:root{--bg:#0a0a0f;--surface:#13131a;--surface2:#1c1c28;--surface3:#242436;--border:#2a2a3d;--accent:#f5c842;--accent-h:#ffd95a;--text:#f0ede8;--text-sub:#b0adb8;--muted:#6b6b85;--success:#4ecb71;--danger:#ff5e5e;--warn:#ff9f43;--info:#5b8fff;--shadow:rgba(0,0,0,0.5);--shadow-sm:rgba(0,0,0,0.3);}
[data-theme="light"]{--bg:#f0eff8;--surface:#ffffff;--surface2:#f5f4fc;--surface3:#ebebf8;--border:#dcdce8;--accent:#e8a800;--accent-h:#f5c000;--text:#1a1a2e;--text-sub:#4a4a6a;--muted:#8888a8;--success:#2ea84f;--danger:#e83030;--warn:#d97706;--info:#3b6fdf;--shadow:rgba(0,0,0,0.12);--shadow-sm:rgba(0,0,0,0.07);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;transition:background .3s,color .3s;}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 700px 450px at 85% 5%,rgba(245,200,66,.05) 0%,transparent 65%),radial-gradient(ellipse 500px 350px at 5% 90%,rgba(91,143,255,.05) 0%,transparent 65%),radial-gradient(ellipse 300px 300px at 50% 50%,rgba(78,203,113,.02) 0%,transparent 70%);transition:opacity .3s;}
[data-theme="light"] body::before{opacity:.6;}
.et-container{max-width:1240px;margin:0 auto;padding:36px 24px 60px;position:relative;z-index:1;}
.et-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;animation:fadeUp .55s ease both;}
.et-header-left{display:flex;align-items:flex-end;gap:20px;}
.et-logo{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;letter-spacing:-1px;line-height:1;}
.et-logo span{color:var(--accent);}
.et-date-badge{background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:7px 16px;font-size:.78rem;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
.et-header-actions{display:flex;gap:8px;}
.et-hbtn{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 14px;color:var(--text-sub);font-size:12px;transition:all .2s;cursor:pointer;font-family:'DM Sans',sans-serif;}
.et-hbtn:hover{border-color:var(--accent);color:var(--accent);}
.et-icon-btn{width:38px;height:38px;background:var(--surface);border:1px solid var(--border);border-radius:10px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;color:var(--text);}
.et-icon-btn:hover{border-color:var(--accent);transform:translateY(-1px);}
.et-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;animation:fadeUp .55s .08s ease both;}
.et-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:26px;position:relative;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s;}
.et-card:hover{transform:translateY(-3px);border-color:var(--accent);box-shadow:0 10px 30px var(--shadow-sm);}
.et-card::after{content:'';position:absolute;top:0;right:0;width:90px;height:90px;border-radius:50%;opacity:.07;transform:translate(24px,-24px);}
.et-card.bal::after{background:var(--accent);}.et-card.inc::after{background:var(--success);}.et-card.exp::after{background:var(--danger);}
.et-card-label{font-size:.73rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:11px;}
.et-card-amount{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;line-height:1;transition:color .3s;}
.et-card.bal .et-card-amount{color:var(--accent);}.et-card.inc .et-card-amount{color:var(--success);}.et-card.exp .et-card-amount{color:var(--danger);}
.et-card-icon{position:absolute;top:22px;right:22px;font-size:1.3rem;opacity:.55;}
.et-alert{border-radius:14px;padding:15px 20px;display:flex;align-items:center;gap:14px;margin-bottom:22px;animation:slideDown .3s ease both;}
.et-alert.warning{background:rgba(255,159,67,.1);border:1px solid rgba(255,159,67,.35);}
.et-alert.exceeded{background:rgba(255,94,94,.1);border:1px solid rgba(255,94,94,.45);}
.et-alert-icon{font-size:1.5rem;flex-shrink:0;}
.et-alert-txt{flex:1;}
.et-alert-title{font-weight:700;font-size:.92rem;margin-bottom:2px;}
.et-alert.warning .et-alert-title{color:var(--warn);}.et-alert.exceeded .et-alert-title{color:var(--danger);}
.et-alert-sub{font-size:.8rem;color:var(--muted);}
.et-alert-x{background:transparent;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem;line-height:1;padding:4px 8px;border-radius:8px;transition:color .2s;}
.et-alert-x:hover{color:var(--danger);}
.et-main-grid{display:grid;grid-template-columns:360px 1fr;gap:22px;align-items:start;}
.et-panel{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:26px;animation:fadeUp .55s .16s ease both;position:sticky;top:20px;}
.et-panel-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;margin-bottom:20px;}
.et-type-toggle{display:grid;grid-template-columns:1fr 1fr;background:var(--surface2);border-radius:12px;padding:4px;margin-bottom:20px;}
.et-type-btn{padding:9px;border:none;background:transparent;color:var(--muted);border-radius:9px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;transition:all .2s;}
.et-type-btn.active{background:var(--surface);color:var(--text);box-shadow:0 2px 8px var(--shadow-sm);}
.et-type-btn.active.income{color:var(--success);}.et-type-btn.active.expense{color:var(--danger);}
.et-blocked-msg{background:rgba(255,94,94,.12);border:1px solid rgba(255,94,94,.4);border-radius:12px;padding:13px 16px;margin-bottom:14px;text-align:center;color:var(--danger);font-size:.88rem;font-weight:600;}
.et-form-group{margin-bottom:15px;}
.et-label{display:block;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:7px;}
.et-input{width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:11px;padding:12px 14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.92rem;outline:none;transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;appearance:none;}
.et-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(245,200,66,.12);}
.et-input::placeholder{color:var(--muted);}
.et-input option{background:var(--surface2);color:var(--text);}
.et-amount-wrap{position:relative;}
.et-currency{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;}
.et-amount-wrap .et-input{padding-left:26px;}
.et-inputs-locked .et-input{opacity:.35;pointer-events:none;}
.et-submit-btn{width:100%;padding:14px;background:var(--accent);color:#0a0a0f;border:none;border-radius:13px;font-family:'DM Sans',sans-serif;font-size:.96rem;font-weight:700;cursor:pointer;margin-top:4px;transition:all .2s;letter-spacing:.02em;}
.et-submit-btn:hover:not(:disabled){background:var(--accent-h);transform:translateY(-1px);box-shadow:0 8px 22px rgba(245,200,66,.28);}
.et-submit-btn:disabled{background:var(--surface3);color:var(--muted);cursor:not-allowed;}
.et-cancel-btn{width:100%;padding:10px;background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:13px;font-family:'DM Sans',sans-serif;font-size:.88rem;cursor:pointer;margin-top:8px;transition:all .2s;}
.et-cancel-btn:hover{border-color:var(--danger);color:var(--danger);}
.et-divider{border:none;border-top:1px solid var(--border);margin:18px 0;}
.et-budget-section-title{font-size:.9rem;font-weight:600;margin-bottom:12px;display:flex;align-items:center;gap:6px;color:var(--text-sub);}
.et-limit-row{display:flex;gap:8px;align-items:flex-end;}
.et-limit-row .et-form-group{flex:1;margin-bottom:0;}
.et-set-limit-btn{padding:12px 14px;background:var(--surface2);color:var(--accent);border:1px solid var(--accent);border-radius:11px;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0;}
.et-set-limit-btn:hover{background:rgba(245,200,66,.1);}
.et-clear-limit-btn{padding:5px 12px;background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:9px;font-family:'DM Sans',sans-serif;font-size:.76rem;cursor:pointer;transition:all .2s;margin-top:8px;}
.et-clear-limit-btn:hover{border-color:var(--danger);color:var(--danger);}
.et-limit-status-row{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:var(--muted);margin-top:12px;}
.et-limit-bar-wrap{height:6px;background:var(--surface2);border-radius:100px;overflow:hidden;margin-top:8px;}
.et-limit-bar-fill{height:100%;border-radius:100px;transition:width .5s cubic-bezier(.4,0,.2,1),background .3s;}
.et-limit-remaining{margin-top:5px;font-size:.76rem;color:var(--muted);text-align:right;}
.et-right-panel{display:flex;flex-direction:column;gap:20px;animation:fadeUp .55s .24s ease both;}
.et-chart-panel{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:26px;}
.et-chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;}
.et-chart-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;}
.et-chart-tabs{display:flex;gap:6px;}
.et-chart-tab{padding:5px 13px;border-radius:100px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:.76rem;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
.et-chart-tab.active,.et-chart-tab:hover{background:var(--accent);color:#0a0a0f;border-color:var(--accent);}
.et-charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.et-chart-box-title{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;}
.et-chart-wrap{position:relative;width:100%;height:220px;background:var(--surface2);border-radius:10px;overflow-x:auto;overflow-y:hidden;}
.et-chart-wrap canvas{display:block;min-width:400px;}
.et-budget-bar{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 20px;}
.et-budget-header{display:flex;justify-content:space-between;font-size:.78rem;color:var(--muted);margin-bottom:9px;text-transform:uppercase;letter-spacing:.06em;}
.et-progress-track{height:6px;background:var(--surface2);border-radius:100px;overflow:hidden;}
.et-progress-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,var(--success),var(--accent));transition:width .5s cubic-bezier(.4,0,.2,1);}
.et-filters-bar{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin-bottom:16px;}
.et-filters-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.et-filters-row+.et-filters-row{margin-top:10px;}
.et-search-wrap{position:relative;flex:1;min-width:160px;}
.et-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;font-size:.9rem;}
.et-search-wrap .et-input{padding-left:32px;}
.et-chip-group{display:flex;gap:6px;flex-wrap:wrap;}
.et-chip{padding:5px 13px;border-radius:100px;border:1px solid var(--border);background:transparent;color:var(--muted);font-size:.78rem;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;white-space:nowrap;}
.et-chip.active,.et-chip:hover{background:var(--accent);color:#0a0a0f;border-color:var(--accent);}
.et-custom-range{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.et-custom-range .et-input{width:auto;flex:1;min-width:130px;}
.et-apply-btn{padding:8px 16px;background:var(--info);color:#fff;border:none;border-radius:9px;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;}
.et-apply-btn:hover{opacity:.85;}
.et-sort-select{padding:6px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:.8rem;cursor:pointer;outline:none;-webkit-appearance:none;appearance:none;}
.et-sort-dir-btn{width:32px;height:32px;background:var(--surface2);border:1px solid var(--border);border-radius:9px;color:var(--muted);font-size:.9rem;cursor:pointer;transition:all .2s;}
.et-sort-dir-btn:hover{border-color:var(--accent);color:var(--accent);}
.et-list-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.et-list-title{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;}
.et-transactions{display:flex;flex-direction:column;gap:8px;}
.et-tx{background:var(--surface2);border:1px solid var(--border);border-radius:13px;padding:14px 16px;display:flex;align-items:center;gap:12px;transition:transform .18s,background .18s;animation:slideIn .3s ease both;position:relative;overflow:hidden;}
.et-tx:hover{transform:translateX(4px);background:var(--surface3);}
.et-tx::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:0 2px 2px 0;}
.et-tx.income-tx::before{background:var(--success);}.et-tx.expense-tx::before{background:var(--danger);}
.et-tx-icon{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.05rem;flex-shrink:0;}
.income-tx .et-tx-icon{background:rgba(78,203,113,.12);}.expense-tx .et-tx-icon{background:rgba(255,94,94,.12);}
.et-tx-info{flex:1;min-width:0;}
.et-tx-desc{font-weight:500;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.et-tx-meta{font-size:.72rem;color:var(--muted);margin-top:3px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.et-tx-cat{background:var(--surface);padding:2px 7px;border-radius:100px;}
.et-tx-right{text-align:right;flex-shrink:0;}
.et-tx-amount{font-family:'Playfair Display',serif;font-size:.96rem;font-weight:700;}
.income-tx .et-tx-amount{color:var(--success);}.expense-tx .et-tx-amount{color:var(--danger);}
.et-tx-balance{font-size:.7rem;color:var(--muted);margin-top:2px;}
.et-tx-balance.pos{color:var(--success);}.et-tx-balance.neg{color:var(--danger);}
.et-tx-actions{display:flex;gap:4px;opacity:0;transition:opacity .2s;flex-shrink:0;}
.et-tx:hover .et-tx-actions{opacity:1;}
.et-tx-btn{width:30px;height:30px;border-radius:8px;background:transparent;border:1px solid var(--border);cursor:pointer;font-size:.82rem;display:flex;align-items:center;justify-content:center;transition:all .18s;color:var(--muted);}
.et-tx-btn.edit:hover{border-color:var(--info);color:var(--info);background:rgba(91,143,255,.1);}
.et-tx-btn.del:hover{border-color:var(--danger);color:var(--danger);background:rgba(255,94,94,.1);}
.et-empty{text-align:center;padding:48px 20px;color:var(--muted);}
.et-empty-icon{font-size:2.4rem;margin-bottom:10px;opacity:.4;}
.et-empty-label{font-weight:600;font-size:.95rem;margin-bottom:4px;color:var(--text-sub);}
.et-empty-sub{font-size:.82rem;}
.et-toast{position:fixed;bottom:28px;right:28px;background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:13px 18px;font-size:.88rem;max-width:360px;box-shadow:0 16px 48px var(--shadow);transform:translateY(120px);opacity:0;transition:all .35s cubic-bezier(.34,1.56,.64,1);z-index:500;color:var(--text);}
.et-toast.show{transform:translateY(0);opacity:1;}
.et-toast.success{border-left:3px solid var(--success);}.et-toast.remove{border-left:3px solid var(--danger);}.et-toast.warning{border-left:3px solid var(--warn);}
.et-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:600;opacity:0;pointer-events:none;transition:opacity .3s;}
.et-modal-overlay.show{opacity:1;pointer-events:all;}
.et-modal{background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:38px 32px;max-width:460px;width:92%;transform:scale(.88) translateY(16px);transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
.et-modal-overlay.show .et-modal{transform:scale(1) translateY(0);}
.et-modal-icon{font-size:3.2rem;margin-bottom:14px;display:block;animation:bounce .6s ease infinite alternate;}
.et-modal-title{font-family:'Playfair Display',serif;font-size:1.55rem;font-weight:900;color:var(--danger);margin-bottom:10px;}
.et-modal-body{color:var(--muted);line-height:1.7;font-size:.92rem;margin-bottom:24px;}
.et-modal-body strong{color:var(--text);}
.et-modal-actions{display:flex;gap:10px;justify-content:flex-end;}
.et-modal-btn{background:var(--danger);color:#fff;border:none;padding:12px 24px;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:all .2s;}
.et-modal-btn:hover{background:#ff7a7a;transform:translateY(-1px);}
.et-modal-btn-sec{background:transparent;color:var(--muted);border:1px solid var(--border);padding:12px 24px;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:.92rem;cursor:pointer;transition:all .2s;}
.et-modal-btn-sec:hover{border-color:var(--accent);color:var(--accent);}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
@keyframes bounce{from{transform:translateY(0);}to{transform:translateY(-8px);}}
@media(max-width:960px){.et-main-grid{grid-template-columns:1fr;}.et-charts-grid{grid-template-columns:1fr;}.et-panel{position:static;}}
@media(max-width:640px){.et-summary{grid-template-columns:1fr;}.et-header{flex-wrap:wrap;gap:12px;}.et-header-left{flex-direction:column;align-items:flex-start;gap:8px;}}
`;

export default GLOBAL_CSS;
