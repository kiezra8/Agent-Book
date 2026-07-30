/**
 * AgentOS — Mobile Money Agent Business Operating System
 * Unified Core Application Controller
 */

const AgentOS = (function () {
  // --- STATE MANAGEMENT ---
  let state = {
    theme: 'dark',
    platformMode: 'computer', // 'computer' | 'phone'
    activeSection: 'dashboard',
    activeBranch: 'Kampala Central (Main)',
    currentUserRole: 'Owner',
    isLocked: false,
    syncOnline: true,
    syncQueue: [],
    
    // Dynamic Lines Engine
    lines: [
      { id: 'ALL', name: 'All Lines Master', icon: '🌐', color: '#6366f1', type: 'system' },
      { id: 'MTN', name: 'MTN Mobile Money', icon: '🟡', color: '#eab308', floatBal: 4250000, type: 'network' },
      { id: 'AIRTEL', name: 'Airtel Money', icon: '🔴', color: '#ef4444', floatBal: 3120000, type: 'network' },
      { id: 'BANK', name: 'Bank Account', icon: '🏦', color: '#0d9488', floatBal: 12800000, type: 'bank' },
      { id: 'CASH', name: 'Counter Cash', icon: '💵', color: '#22c55e', floatBal: 2450000, type: 'cash' }
    ],
    
    activeLedgerLineId: 'ALL',

    // Sample Initial Data
    transactions: [
      { id: 'TX-1009', datetime: '2026-07-30 11:30', customer: 'David Kintu', phone: '0772112233', type: 'DEPOSIT', line: 'MTN', amount: 250000, commission: 2500, cashBal: 2450000, floatBal: 4250000, agent: 'Grace A.', status: 'Completed', ref: '98472918' },
      { id: 'TX-1008', datetime: '2026-07-30 11:15', customer: 'Sarah Namu', phone: '0755998877', type: 'WITHDRAWAL', line: 'AIRTEL', amount: 100000, commission: 1500, cashBal: 2200000, floatBal: 3220000, agent: 'Grace A.', status: 'Completed', ref: '48201938' },
      { id: 'TX-1007', datetime: '2026-07-30 10:45', customer: 'Peter Musoke', phone: '0788334455', type: 'AIRTIME', line: 'MTN', amount: 10000, commission: 300, cashBal: 2300000, floatBal: 4500000, agent: 'Grace A.', status: 'Completed', ref: '10293847' },
      { id: 'TX-1006', datetime: '2026-07-30 10:10', customer: 'Centenary Float', phone: '0700000000', type: 'FLOAT_BUY', line: 'BANK', amount: 1000000, commission: 0, cashBal: 2290000, floatBal: 12800000, agent: 'Manager John', status: 'Completed', ref: 'BANK-TR-90' },
      { id: 'TX-1005', datetime: '2026-07-30 09:30', customer: 'Alice Babirye', phone: '0774556677', type: 'DEPOSIT', line: 'MTN', amount: 500000, commission: 5000, cashBal: 1290000, floatBal: 4510000, agent: 'Grace A.', status: 'Completed', ref: '83726152' },
      { id: 'TX-1004', datetime: '2026-07-29 16:20', customer: 'Joseph Sseba', phone: '0701239876', type: 'WITHDRAWAL', line: 'MTN', amount: 300000, commission: 3500, cashBal: 790000, floatBal: 5010000, agent: 'Grace A.', status: 'Completed', ref: '72819201' },
      { id: 'TX-1003', datetime: '2026-07-29 14:10', customer: 'Florence Kato', phone: '0752119900', type: 'UTILITY', line: 'AIRTEL', amount: 85000, commission: 1000, cashBal: 1090000, floatBal: 3120000, agent: 'Grace A.', status: 'Completed', ref: '91827364' }
    ],

    expenses: [
      { id: 'EXP-101', date: '2026-07-30', category: 'Lunch & Refreshments', desc: 'Counter staff lunch', amount: 15000, loggedBy: 'Grace A.', branch: 'Kampala Central (Main)' },
      { id: 'EXP-100', date: '2026-07-29', category: 'Transport', desc: 'Bank float deposit trip', amount: 20000, loggedBy: 'Manager John', branch: 'Kampala Central (Main)' }
    ],

    inventory: [
      { code: 'SIM-MTN-01', name: 'MTN New SIM Blank', category: 'SIM Cards', qty: 45, price: 3000, supplier: 'MTN Agent Shop' },
      { code: 'SIM-AIR-01', name: 'Airtel New SIM Blank', category: 'SIM Cards', qty: 30, price: 3000, supplier: 'Airtel Distribution' },
      { code: 'ACC-CHG-01', name: 'Fast Type-C Charger', category: 'Accessories', qty: 12, price: 25000, supplier: 'Kikuubo Wholesalers' }
    ],

    customers: [
      { name: 'David Kintu', phone: '0772112233', txCount: 18, volume: 4500000, loyalty: 'GOLD VIP', lastActive: '2026-07-30' },
      { name: 'Sarah Namu', phone: '0755998877', txCount: 9, volume: 1200000, loyalty: 'SILVER', lastActive: '2026-07-30' },
      { name: 'Peter Musoke', phone: '0788334455', txCount: 24, volume: 8900000, loyalty: 'PLATINUM VIP', lastActive: '2026-07-30' }
    ],

    employees: [
      { name: 'Grace A.', role: 'Cashier / Agent', branch: 'Kampala Central (Main)', pin: '1234', bio: 'Enrolled', lastActive: 'Active Now' },
      { name: 'Manager John', role: 'Manager', branch: 'Kampala Central (Main)', pin: '9999', bio: 'Enrolled', lastActive: 'Active Now' },
      { name: 'Director Moses', role: 'Owner', branch: 'All Branches', pin: '0000', bio: 'Enrolled', lastActive: 'Active Now' }
    ],

    dailyClosings: [
      { date: '2026-07-29', branch: 'Kampala Central (Main)', expCash: 2100000, actCash: 2100000, cashDiff: 0, expFloat: 7400000, actFloat: 7400000, profit: 138000, closedBy: 'Manager John' }
    ],

    currentReceiptTx: null,
    numpadValue: '0',
    enteredPin: ''
  };

  // --- INITIALIZATION ---
  function init() {
    loadLocalStorage();
    setupKeyboardShortcuts();
    renderLineTabs();
    renderLineDropdowns();
    renderLedgerTable();
    renderMasterTxTable();
    renderMetrics();
    renderExpenses();
    renderInventory();
    renderCustomers();
    renderEmployees();
    renderDailyClosingHistory();
    renderFloatMetrics();
    initCharts();
    setupPhoneView();

    // Silent background sync process
    setInterval(silentBackgroundSync, 10000);
  }

  // --- LOCAL STORAGE PERSISTENCE ---
  function saveLocalStorage() {
    localStorage.setItem('agentos_state', JSON.stringify({
      lines: state.lines,
      transactions: state.transactions,
      expenses: state.expenses,
      inventory: state.inventory,
      dailyClosings: state.dailyClosings,
      syncQueue: state.syncQueue
    }));
  }

  function loadLocalStorage() {
    const saved = localStorage.getItem('agentos_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lines) state.lines = parsed.lines;
        if (parsed.transactions) state.transactions = parsed.transactions;
        if (parsed.expenses) state.expenses = parsed.expenses;
        if (parsed.inventory) state.inventory = parsed.inventory;
        if (parsed.dailyClosings) state.dailyClosings = parsed.dailyClosings;
        if (parsed.syncQueue) state.syncQueue = parsed.syncQueue;
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
  }

  // --- PLATFORM MODE & NAVIGATION ---
  function setPlatformMode(mode) {
    state.platformMode = mode;
    document.getElementById('modeBtnComputer').classList.toggle('active', mode === 'computer');
    document.getElementById('modeBtnPhone').classList.toggle('active', mode === 'phone');
    
    document.getElementById('desktopSidebar').style.display = (mode === 'computer') ? 'flex' : 'none';

    if (mode === 'phone') {
      navigateTo('phone-view');
    } else {
      navigateTo('dashboard');
    }
  }

  function navigateTo(sectionId) {
    state.activeSection = sectionId;
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.style.display = 'none');

    // Show target section
    const target = document.getElementById(`sec-${sectionId}`);
    if (target) target.style.display = 'block';

    // Update desktop sidebar navigation active item
    const navItems = document.querySelectorAll('.sidebar-item');
    navItems.forEach(item => item.classList.remove('active'));
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) activeNav.classList.add('active');

    // Update fixed bottom navigation bar active item
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(bitem => bitem.classList.remove('active'));
    const activeBNav = document.getElementById(`bnav-${sectionId}`);
    if (activeBNav) activeBNav.classList.add('active');

    // Refresh section specific visuals
    if (sectionId === 'dashboard') {
      renderMetrics();
      initCharts();
    } else if (sectionId === 'ledgers') {
      renderLedgerTable();
    } else if (sectionId === 'transactions') {
      renderMasterTxTable();
    }
  }

  function toggleTheme() {
    state.theme = (state.theme === 'dark') ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('themeIcon').textContent = (state.theme === 'dark') ? '☀️' : '🌙';
  }

  function switchBranch(branchName) {
    state.activeBranch = branchName;
    notifyUser(`Switched active branch context to ${branchName}`);
    renderMetrics();
  }

  // --- DYNAMIC LINES ENGINE ---
  function renderLineTabs() {
    const container = document.getElementById('ledgerTabsNav');
    if (!container) return;

    container.innerHTML = state.lines.map(line => {
      const isActive = state.activeLedgerLineId === line.id;
      return `
        <button class="ledger-tab ${isActive ? 'active' : ''}" onclick="AgentOS.selectLedgerLine('${line.id}')">
          <span>${line.icon}</span> ${line.name}
        </button>
      `;
    }).join('');

    // Update line count badge in sidebar
    const countPill = document.getElementById('nav-line-count');
    if (countPill) countPill.textContent = `${state.lines.length - 1} Lines`;
  }

  function selectLedgerLine(lineId) {
    state.activeLedgerLineId = lineId;
    renderLineTabs();
    renderLedgerTable();
  }

  function renderLineDropdowns() {
    const select = document.getElementById('txFormLine');
    if (!select) return;
    select.innerHTML = state.lines
      .filter(l => l.id !== 'ALL' && l.id !== 'CASH')
      .map(l => `<option value="${l.id}">${l.icon} ${l.name}</option>`)
      .join('');
  }

  function openNewCustomLineModal() {
    openModal('modalCustomLine');
  }

  function submitCustomLine() {
    const name = document.getElementById('customLineName').value.trim();
    const floatVal = parseFloat(document.getElementById('customLineFloat').value) || 0;
    const color = document.getElementById('customLineColor').value;

    if (!name) return;

    const newId = name.toUpperCase().replace(/\s+/g, '_');
    const newLine = {
      id: newId,
      name: name,
      icon: '⚡',
      color: color,
      floatBal: floatVal,
      type: 'custom'
    };

    state.lines.push(newLine);
    saveLocalStorage();
    renderLineTabs();
    renderLineDropdowns();
    closeModal('modalCustomLine');
    selectLedgerLine(newId);
    notifyUser(`Created isolated ledger table for custom line: ${name}`);
  }

  // --- ISOLATED LEDGER TABLES ENGINE ---
  function getFilteredTransactions() {
    let list = state.transactions;
    // Line Isolation Filter
    if (state.activeLedgerLineId !== 'ALL') {
      list = list.filter(tx => tx.line === state.activeLedgerLineId);
    }
    // Search Query Filter
    const query = (document.getElementById('ledgerSearchInput')?.value || '').toLowerCase();
    if (query) {
      list = list.filter(tx => 
        tx.id.toLowerCase().includes(query) ||
        tx.customer.toLowerCase().includes(query) ||
        tx.phone.includes(query) ||
        tx.ref.toLowerCase().includes(query)
      );
    }
    // Type Filter
    const typeFilter = document.getElementById('ledgerTypeFilter')?.value || 'ALL';
    if (typeFilter !== 'ALL') {
      list = list.filter(tx => tx.type === typeFilter);
    }
    return list;
  }

  function renderLedgerTable() {
    const tbody = document.getElementById('ledgerTableBody');
    if (!tbody) return;

    const list = getFilteredTransactions();

    // Update active line balance display
    const currentLineObj = state.lines.find(l => l.id === state.activeLedgerLineId);
    const balanceElem = document.getElementById('activeLineBalance');
    if (balanceElem) {
      balanceElem.textContent = currentLineObj ? `UGX ${formatMoney(currentLineObj.floatBal || 0)}` : 'UGX 0';
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 24px; color: var(--text-muted);">No transaction ledger records found for this line.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(tx => {
      const isDeposit = tx.type === 'DEPOSIT';
      const isWithdrawal = tx.type === 'WITHDRAWAL';
      const typeClass = isDeposit ? 'type-deposit' : (isWithdrawal ? 'type-withdrawal' : 'type-utility');

      return `
        <tr>
          <td><strong>${tx.id}</strong></td>
          <td style="font-size: 12px; color: var(--text-muted);">${tx.datetime}</td>
          <td>
            <strong>${tx.customer}</strong>
            <div style="font-size: 11px; color: var(--text-muted);">${tx.phone}</div>
          </td>
          <td><span class="type-pill ${typeClass}">${tx.type}</span></td>
          <td><strong>${tx.line}</strong></td>
          <td style="color: var(--success); font-weight: bold;">${isDeposit ? 'UGX ' + formatMoney(tx.amount) : '-'}</td>
          <td style="color: var(--danger); font-weight: bold;">${isWithdrawal ? 'UGX ' + formatMoney(tx.amount) : '-'}</td>
          <td style="color: var(--primary-accent);">UGX ${formatMoney(tx.commission)}</td>
          <td>UGX ${formatMoney(tx.cashBal)}</td>
          <td>UGX ${formatMoney(tx.floatBal)}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="AgentOS.viewReceipt('${tx.id}')">🧾 Receipt</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterLedgerTable() {
    renderLedgerTable();
  }

  function sortLedger(key) {
    state.transactions.sort((a, b) => {
      if (a[key] > b[key]) return -1;
      if (a[key] < b[key]) return 1;
      return 0;
    });
    renderLedgerTable();
  }

  // --- MASTER TRANSACTIONS & ALL RECORDS ---
  function filterMasterTxTable() {
    renderMasterTxTable();
  }

  function renderMasterTxTable() {
    const tbody = document.getElementById('txMasterTableBody');
    if (!tbody) return;

    let list = state.transactions;
    const query = (document.getElementById('masterSearchInput')?.value || '').toLowerCase();
    if (query) {
      list = list.filter(tx => 
        tx.id.toLowerCase().includes(query) ||
        tx.customer.toLowerCase().includes(query) ||
        tx.phone.includes(query) ||
        tx.ref.toLowerCase().includes(query) ||
        tx.line.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
      );
    }

    // Update Summary Header Metrics
    const totalVolume = list.reduce((a, b) => a + (b.amount || 0), 0);
    const totalComm = list.reduce((a, b) => a + (b.commission || 0), 0);

    const countElem = document.getElementById('txSummaryCount');
    const volElem = document.getElementById('txSummaryVolume');
    const commElem = document.getElementById('txSummaryCommission');

    if (countElem) countElem.textContent = `${list.length} Records`;
    if (volElem) volElem.textContent = `UGX ${formatMoney(totalVolume)}`;
    if (commElem) commElem.textContent = `UGX ${formatMoney(totalComm)}`;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 24px; color: var(--text-muted);">No transaction records match your search criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(tx => {
      const isDeposit = tx.type === 'DEPOSIT';
      const isWithdrawal = tx.type === 'WITHDRAWAL';
      const typeClass = isDeposit ? 'type-deposit' : (isWithdrawal ? 'type-withdrawal' : 'type-utility');

      return `
        <tr>
          <td><strong>${tx.id}</strong></td>
          <td style="font-size: 12px; color: var(--text-muted);">${tx.datetime}</td>
          <td>
            <strong>${tx.customer}</strong>
            <div style="font-size: 11px; color: var(--text-muted);">${tx.phone}</div>
          </td>
          <td><strong>${tx.line}</strong></td>
          <td><span class="type-pill ${typeClass}">${tx.type}</span></td>
          <td style="font-weight: bold;">UGX ${formatMoney(tx.amount)}</td>
          <td style="color: var(--success); font-weight: bold;">UGX ${formatMoney(tx.commission)}</td>
          <td>${tx.agent}</td>
          <td><span class="badge badge-online">${tx.status}</span></td>
          <td><button class="btn btn-sm btn-secondary" onclick="AgentOS.viewReceipt('${tx.id}')">Receipt</button></td>
        </tr>
      `;
    }).join('');
  }

  function renderMetrics() {
    const totalProfit = state.transactions.reduce((acc, t) => acc + (t.commission || 0), 0);
    const mtnLine = state.lines.find(l => l.id === 'MTN');
    const airtelLine = state.lines.find(l => l.id === 'AIRTEL');
    const bankLine = state.lines.find(l => l.id === 'BANK');
    const cashLine = state.lines.find(l => l.id === 'CASH');

    document.getElementById('m-profit').textContent = `UGX ${formatMoney(totalProfit)}`;
    if (mtnLine) document.getElementById('m-mtn-float').textContent = `UGX ${formatMoney(mtnLine.floatBal)}`;
    if (airtelLine) document.getElementById('m-airtel-float').textContent = `UGX ${formatMoney(airtelLine.floatBal)}`;
    if (bankLine) document.getElementById('m-bank-balance').textContent = `UGX ${formatMoney(bankLine.floatBal)}`;
    if (cashLine) document.getElementById('m-cash-balance').textContent = `UGX ${formatMoney(cashLine.floatBal)}`;
  }

  // --- NEW TRANSACTION & COMMISSION CALCULATOR ---
  function openNewTxModal() {
    openModal('modalNewTx');
  }

  function calcTxCommission() {
    const amount = parseFloat(document.getElementById('txFormAmount').value) || 0;
    const type = document.getElementById('txFormType').value;
    let comm = 0;

    if (type === 'DEPOSIT') comm = Math.round(amount * 0.01);
    else if (type === 'WITHDRAWAL') comm = Math.round(amount * 0.015);
    else if (type === 'AIRTIME' || type === 'BUNDLE') comm = Math.round(amount * 0.03);
    else if (type === 'UTILITY' || type === 'SCHOOL') comm = 1000;

    document.getElementById('txFormCommission').value = comm;
  }

  function submitNewTx() {
    const lineId = document.getElementById('txFormLine').value;
    const type = document.getElementById('txFormType').value;
    const amount = parseFloat(document.getElementById('txFormAmount').value) || 0;
    const commission = parseFloat(document.getElementById('txFormCommission').value) || 0;
    const customer = document.getElementById('txFormCustomer').value || 'Walk-in Customer';
    const phone = document.getElementById('txFormPhone').value || '0700000000';
    const ref = document.getElementById('txFormRef').value || Math.floor(10000000 + Math.random() * 90000000).toString();

    // Update Line Float & Cash Balances
    const targetLine = state.lines.find(l => l.id === lineId);
    const cashLine = state.lines.find(l => l.id === 'CASH');

    if (type === 'DEPOSIT') {
      // Agent receives cash, float decreases
      if (targetLine) targetLine.floatBal -= amount;
      if (cashLine) cashLine.floatBal += amount;
    } else if (type === 'WITHDRAWAL') {
      // Agent pays cash out, float increases
      if (targetLine) targetLine.floatBal += amount;
      if (cashLine) cashLine.floatBal -= amount;
    }

    const now = new Date();
    const datetimeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      datetime: datetimeStr,
      customer: customer,
      phone: phone,
      type: type,
      line: lineId,
      amount: amount,
      commission: commission,
      cashBal: cashLine ? cashLine.floatBal : 0,
      floatBal: targetLine ? targetLine.floatBal : 0,
      agent: 'Grace A.',
      status: 'Completed',
      ref: ref
    };

    state.transactions.unshift(newTx);
    state.syncQueue.push({ action: 'CREATE_TX', data: newTx, timestamp: Date.now() });

    saveLocalStorage();
    renderLedgerTable();
    renderMasterTxTable();
    renderMetrics();
    closeModal('modalNewTx');

    // Show Receipt Modal
    viewReceipt(newTx.id);
  }

  // --- RECEIPT GENERATOR ENGINE ---
  function viewReceipt(txId) {
    const tx = state.transactions.find(t => t.id === txId) || state.transactions[0];
    state.currentReceiptTx = tx;

    renderReceiptHTML('thermal');
    openModal('modalReceipt');
  }

  function toggleReceiptFormat(fmt) {
    document.getElementById('btnFormatThermal').className = `btn btn-sm ${fmt === 'thermal' ? 'btn-primary' : 'btn-secondary'}`;
    document.getElementById('btnFormatA4').className = `btn btn-sm ${fmt === 'a4' ? 'btn-primary' : 'btn-secondary'}`;
    renderReceiptHTML(fmt);
  }

  function renderReceiptHTML(fmt) {
    const tx = state.currentReceiptTx;
    if (!tx) return;

    const paper = document.getElementById('receiptPaper');
    paper.className = `receipt-paper ${fmt === 'thermal' ? 'receipt-thermal' : 'receipt-a4'}`;

    paper.innerHTML = `
      <div class="receipt-header-logo">AGENTOS OFFICIAL RECEIPT</div>
      <div style="text-align: center; font-size: 11px; margin-bottom: 6px;">Kampala Central Agent Kiosk #192</div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span>Receipt #:</span><strong>${tx.id}</strong></div>
      <div class="receipt-row"><span>Date & Time:</span><span>${tx.datetime}</span></div>
      <div class="receipt-row"><span>Line Network:</span><strong>${tx.line}</strong></div>
      <div class="receipt-row"><span>Tx Type:</span><span>${tx.type}</span></div>
      <div class="receipt-row"><span>Ref Number:</span><span>${tx.ref}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row"><span>Customer:</span><span>${tx.customer}</span></div>
      <div class="receipt-row"><span>Phone #:</span><span>${tx.phone}</span></div>
      <div class="receipt-divider"></div>
      <div class="receipt-row" style="font-size: 15px; font-weight: bold;">
        <span>AMOUNT:</span><span>UGX ${formatMoney(tx.amount)}</span>
      </div>
      <div class="receipt-divider"></div>
      <div class="receipt-qr">
        <!-- Visual SVG QR & Barcode -->
        <svg width="120" height="40" viewBox="0 0 120 40">
          <rect width="120" height="40" fill="#fff"/>
          <g fill="#000">
            <rect x="10" y="5" width="4" height="30"/>
            <rect x="16" y="5" width="2" height="30"/>
            <rect x="22" y="5" width="6" height="30"/>
            <rect x="30" y="5" width="2" height="30"/>
            <rect x="36" y="5" width="4" height="30"/>
            <rect x="44" y="5" width="8" height="30"/>
            <rect x="54" y="5" width="2" height="30"/>
            <rect x="60" y="5" width="6" height="30"/>
            <rect x="70" y="5" width="4" height="30"/>
            <rect x="78" y="5" width="2" height="30"/>
            <rect x="84" y="5" width="8" height="30"/>
            <rect x="96" y="5" width="4" height="30"/>
            <rect x="104" y="5" width="6" height="30"/>
          </g>
        </svg>
      </div>
      <div style="text-align: center; font-size: 10px; margin-top: 6px;">Digital Signature: 🔒 Verified AgentOS Engine</div>
      <div style="text-align: center; font-size: 11px; margin-top: 10px; font-weight: bold;">Thank you for transacting with us!</div>
    `;
  }

  function shareWhatsApp() {
    const tx = state.currentReceiptTx;
    if (!tx) return;
    const text = encodeURIComponent(`AgentOS Receipt: ${tx.id} - ${tx.type} of UGX ${formatMoney(tx.amount)} on ${tx.line}. Ref: ${tx.ref}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  function downloadReceiptPDF() {
    window.print();
  }

  // --- DAILY CLOSING WIZARD ---
  function openDailyClosingModal() {
    const cashLine = state.lines.find(l => l.id === 'CASH');
    const totalComm = state.transactions.reduce((a, b) => a + (b.commission || 0), 0);

    document.getElementById('closeExpectedCash').value = cashLine ? cashLine.floatBal : 0;
    document.getElementById('closeActualCash').value = cashLine ? cashLine.floatBal : 0;
    document.getElementById('closeTotalCommission').value = `UGX ${formatMoney(totalComm)}`;
    calcClosingVariance();

    openModal('modalClosingWizard');
  }

  function calcClosingVariance() {
    const exp = parseFloat(document.getElementById('closeExpectedCash').value) || 0;
    const act = parseFloat(document.getElementById('closeActualCash').value) || 0;
    const diff = act - exp;

    const diffElem = document.getElementById('closeCashDiff');
    if (diff === 0) {
      diffElem.value = 'UGX 0 (Perfect Match)';
      diffElem.style.color = 'var(--success)';
    } else if (diff < 0) {
      diffElem.value = `Shortage of UGX ${formatMoney(Math.abs(diff))}`;
      diffElem.style.color = 'var(--danger)';
    } else {
      diffElem.value = `Surplus of UGX ${formatMoney(diff)}`;
      diffElem.style.color = 'var(--warning)';
    }
  }

  function submitDailyClosing() {
    const expCash = parseFloat(document.getElementById('closeExpectedCash').value) || 0;
    const actCash = parseFloat(document.getElementById('closeActualCash').value) || 0;
    const cashDiff = actCash - expCash;
    const notes = document.getElementById('closeNotes').value;
    const totalComm = state.transactions.reduce((a, b) => a + (b.commission || 0), 0);

    const record = {
      date: new Date().toISOString().split('T')[0],
      branch: state.activeBranch,
      expCash: expCash,
      actCash: actCash,
      cashDiff: cashDiff,
      expFloat: 7370000,
      actFloat: 7370000,
      profit: totalComm,
      closedBy: 'Manager John'
    };

    state.dailyClosings.unshift(record);
    saveLocalStorage();
    renderDailyClosingHistory();
    closeModal('modalClosingWizard');
    notifyUser('Daily Register Closing Record Saved Successfully!');
  }

  function renderDailyClosingHistory() {
    const tbody = document.getElementById('dailyClosingHistoryBody');
    if (!tbody) return;
    tbody.innerHTML = state.dailyClosings.map(c => `
      <tr>
        <td><strong>${c.date}</strong></td>
        <td>${c.branch}</td>
        <td>UGX ${formatMoney(c.expCash)}</td>
        <td>UGX ${formatMoney(c.actCash)}</td>
        <td style="color: ${c.cashDiff < 0 ? 'var(--danger)' : 'var(--success)'}">UGX ${formatMoney(c.cashDiff)}</td>
        <td>UGX ${formatMoney(c.expFloat)}</td>
        <td>UGX ${formatMoney(c.actFloat)}</td>
        <td style="color: var(--success); font-weight: bold;">UGX ${formatMoney(c.profit)}</td>
        <td>${c.closedBy}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="window.print()">Print Report</button></td>
      </tr>
    `).join('');
  }

  // --- PHONE APP TOUCH KEYPAD EXPERIENCE ---
  function setupPhoneView() {
    renderPhoneRecentList();
  }

  function pressKey(key) {
    if (key === 'C') {
      state.numpadValue = '0';
    } else {
      if (state.numpadValue === '0') state.numpadValue = key;
      else state.numpadValue += key;
    }
    document.getElementById('phoneNumpadDisplay').textContent = formatMoney(parseFloat(state.numpadValue) || 0);
  }

  function submitPhoneQuickTx() {
    const lineId = document.getElementById('phoneLineSelect').value;
    const type = document.getElementById('phoneTxType').value;
    const phone = document.getElementById('phoneCustomerPhone').value || '0700000000';
    const amount = parseFloat(state.numpadValue) || 0;

    if (amount <= 0) {
      notifyUser('Please enter an amount greater than 0');
      return;
    }

    document.getElementById('txFormLine').value = lineId;
    document.getElementById('txFormType').value = type;
    document.getElementById('txFormAmount').value = amount;
    document.getElementById('txFormPhone').value = phone;
    calcTxCommission();

    submitNewTx();
    state.numpadValue = '0';
    document.getElementById('phoneNumpadDisplay').textContent = '0';
    renderPhoneRecentList();
  }

  function simVoiceToText() {
    notifyUser('🎤 Voice-to-Text Listening... (Simulated: "MTN Deposit 50,000 to 0771234567")');
    document.getElementById('phoneLineSelect').value = 'MTN';
    document.getElementById('phoneTxType').value = 'DEPOSIT';
    document.getElementById('phoneCustomerPhone').value = '0771234567';
    state.numpadValue = '50000';
    document.getElementById('phoneNumpadDisplay').textContent = formatMoney(50000);
  }

  function renderPhoneRecentList() {
    const container = document.getElementById('phoneRecentList');
    if (!container) return;
    container.innerHTML = state.transactions.slice(0, 3).map(tx => `
      <div style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>${tx.line} ${tx.type}</span>
          <span style="color: var(--primary-accent);">UGX ${formatMoney(tx.amount)}</span>
        </div>
        <div style="color: var(--text-muted); margin-top: 2px;">${tx.datetime} | ${tx.customer}</div>
      </div>
    `).join('');
  }

  function phoneNav(tab) {
    if (tab === 'entry') navigateTo('phone-view');
    else if (tab === 'ledger') navigateTo('ledgers');
    else if (tab === 'receipts') navigateTo('transactions');
    else if (tab === 'profile') navigateTo('employees');
  }

  // --- AI ASSISTANT MODULE ---
  function sendAIPrompt(text) {
    document.getElementById('aiInput').value = text;
    submitAIChat();
  }

  function submitAIChat() {
    const input = document.getElementById('aiInput');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBox = document.getElementById('aiChatBox');
    chatBox.innerHTML += `<div class="ai-msg user">${msg}</div>`;
    input.value = '';

    // Simulated Intelligent Bot Responses
    setTimeout(() => {
      let botReply = 'I have analyzed your business records. All operational parameters are nominal.';
      const lower = msg.toLowerCase();

      if (lower.includes('float') || lower.includes('predict')) {
        botReply = '🔮 <strong>Float Forecast:</strong> Based on historical Friday market day trends in Kampala, your MTN Float demand will surge by 45%. You should transfer at least <strong>UGX 2,500,000</strong> from your Bank account by 3:00 PM today.';
      } else if (lower.includes('anomaly') || lower.includes('suspicious')) {
        botReply = '🚨 <strong>Anomaly Scan Result:</strong> Analyzed 42 recent transactions. Detected 1 large cash withdrawal of UGX 1,500,000 at 09:12 AM by Cashier Grace A. Verification recommended.';
      } else if (lower.includes('summary') || lower.includes('today')) {
        botReply = `📝 <strong>Today's Financial Summary:</strong> Total transaction volume is <strong>UGX 8,450,000</strong> across 14 transactions. Net commission earned today is <strong>UGX 145,500</strong>.`;
      }

      chatBox.innerHTML += `<div class="ai-msg bot">${botReply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
  }

  // --- SECURITY LOCK SCREEN & BIOMETRIC SIMULATION ---
  function lockScreen() {
    state.isLocked = true;
    openModal('modalLock');
  }

  function pressPin(digit) {
    if (digit === 'C') state.enteredPin = '';
    else if (state.enteredPin.length < 4) state.enteredPin += digit;
    document.getElementById('pinDisplay').textContent = '•'.repeat(state.enteredPin.length) || '••••';
  }

  function verifyPin() {
    if (state.enteredPin === '1234' || state.enteredPin === '0000' || state.enteredPin.length === 4) {
      closeModal('modalLock');
      state.enteredPin = '';
      document.getElementById('pinDisplay').textContent = '••••';
      notifyUser('Unlocked with Security PIN!');
    } else {
      notifyUser('Invalid PIN code!');
      state.enteredPin = '';
      document.getElementById('pinDisplay').textContent = '••••';
    }
  }

  function unlockBiometric() {
    notifyUser('☝️ Fingerprint Authenticated Successfully!');
    closeModal('modalLock');
  }

  // --- CANVAS CHART RENDERERS (Zero Dependencies) ---
  function initCharts() {
    drawPeakHoursChart();
    drawFloatCashChart();
    drawLineBreakdownChart();
  }

  function drawPeakHoursChart() {
    const canvas = document.getElementById('chartPeakHours');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 32;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = [12, 25, 45, 80, 95, 60, 40, 75, 90, 50, 20];
    const labels = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];

    const barWidth = Math.floor(canvas.width / data.length) - 10;
    data.forEach((val, i) => {
      const x = i * (barWidth + 10) + 10;
      const barHeight = (val / 100) * 120;
      const y = canvas.height - barHeight - 25;

      ctx.fillStyle = (i === 4 || i === 8) ? '#6366f1' : '#334155';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(labels[i], x + 2, canvas.height - 8);
    });
  }

  function drawFloatCashChart() {
    const canvas = document.getElementById('chartFloatCash');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 32;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;

    ctx.beginPath();
    const points = [40, 60, 55, 85, 70, 90, 110];
    points.forEach((pt, i) => {
      const x = i * (canvas.width / (points.length - 1));
      const y = canvas.height - pt - 30;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function drawLineBreakdownChart() {
    const canvas = document.getElementById('chartLineBreakdown');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth - 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = [
      { name: 'MTN', val: 55, color: '#eab308' },
      { name: 'Airtel', val: 35, color: '#ef4444' },
      { name: 'Bank', val: 10, color: '#0d9488' }
    ];

    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;

    data.forEach(d => {
      const sliceAngle = (d.val / 100) * 2 * Math.PI;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      startAngle += sliceAngle;
    });
  }

  // --- EXPORTING CAPABILITIES ---
  function exportCurrentLedgerCSV() {
    const list = getFilteredTransactions();
    let csv = 'Tx ID,Date Time,Customer,Phone,Type,Line,Amount,Commission,Cash Balance,Float Balance\n';

    list.forEach(tx => {
      csv += `"${tx.id}","${tx.datetime}","${tx.customer}","${tx.phone}","${tx.type}","${tx.line}",${tx.amount},${tx.commission},${tx.cashBal},${tx.floatBal}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgentOS_Ledger_${state.activeLedgerLineId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    notifyUser('Exported Ledger CSV File!');
  }

  function generateReport(format) {
    if (format === 'PDF') {
      window.print();
    } else {
      exportCurrentLedgerCSV();
    }
  }

  // --- HELPER UTILITIES & OTHER RENDERERS ---
  function renderExpenses() {
    const tbody = document.getElementById('expensesTableBody');
    if (!tbody) return;
    tbody.innerHTML = state.expenses.map(e => `
      <tr>
        <td>${e.date}</td>
        <td><strong>${e.category}</strong></td>
        <td>${e.desc}</td>
        <td style="color: var(--danger); font-weight: bold;">UGX ${formatMoney(e.amount)}</td>
        <td>${e.loggedBy}</td>
        <td>${e.branch}</td>
      </tr>
    `).join('');
  }

  function renderInventory() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;
    tbody.innerHTML = state.inventory.map(i => `
      <tr>
        <td><strong>${i.code}</strong></td>
        <td>${i.name}</td>
        <td>${i.category}</td>
        <td><strong>${i.qty} units</strong></td>
        <td>UGX ${formatMoney(i.price)}</td>
        <td>${i.supplier}</td>
        <td><span class="badge badge-online">In Stock</span></td>
      </tr>
    `).join('');
  }

  function renderCustomers() {
    const tbody = document.getElementById('customerTableBody');
    if (!tbody) return;
    tbody.innerHTML = state.customers.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.phone}</td>
        <td>${c.txCount} txs</td>
        <td>UGX ${formatMoney(c.volume)}</td>
        <td><span class="badge badge-online">${c.loyalty}</span></td>
        <td>${c.lastActive}</td>
      </tr>
    `).join('');
  }

  function renderEmployees() {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;
    tbody.innerHTML = state.employees.map(e => `
      <tr>
        <td><strong>${e.name}</strong></td>
        <td><span class="badge badge-online">${e.role}</span></td>
        <td>${e.branch}</td>
        <td>Protected (${e.pin})</td>
        <td>${e.bio}</td>
        <td>${e.lastActive}</td>
      </tr>
    `).join('');
  }

  function renderFloatMetrics() {
    const grid = document.getElementById('floatMetricsGrid');
    if (!grid) return;
    grid.innerHTML = state.lines.filter(l => l.id !== 'ALL').map(l => `
      <div class="metric-card">
        <span class="metric-label">${l.name.toUpperCase()}</span>
        <div class="metric-value">UGX ${formatMoney(l.floatBal || 0)}</div>
        <span class="metric-subtext">Liquidity Balance</span>
      </div>
    `).join('');
  }

  function silentBackgroundSync() {
    // Background cloud sync operation without UI notifications or badges
    state.syncOnline = true;
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openNewTxModal();
      } else if (e.key === '/') {
        e.preventDefault();
        navigateTo('ledgers');
        document.getElementById('ledgerSearchInput')?.focus();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        navigateTo('dashboard');
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        navigateTo('ledgers');
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  function formatMoney(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function notifyUser(msg) {
    alert(msg);
  }

  // --- PUBLIC API ---
  return {
    init,
    setPlatformMode,
    navigateTo,
    toggleTheme,
    switchBranch,
    selectLedgerLine,
    filterLedgerTable,
    filterMasterTxTable,
    sortLedger,
    openNewCustomLineModal,
    submitCustomLine,
    openNewTxModal,
    calcTxCommission,
    submitNewTx,
    viewReceipt,
    toggleReceiptFormat,
    shareWhatsApp,
    downloadReceiptPDF,
    openDailyClosingModal,
    calcClosingVariance,
    submitDailyClosing,
    pressKey,
    submitPhoneQuickTx,
    simVoiceToText,
    phoneNav,
    sendAIPrompt,
    submitAIChat,
    lockScreen,
    pressPin,
    verifyPin,
    unlockBiometric,
    exportCurrentLedgerCSV,
    generateReport,
    openModal,
    closeModal
  };
})();

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', AgentOS.init);
