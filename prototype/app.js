'use strict';

// ===== DATA LAYER =====
const STORAGE_KEY = 'trello_proto';

function loadData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData();
  } catch {
    return defaultData();
  }
}

function defaultData() {
  return { boards: [], lists: [], cards: [], labels: [], cardLabels: [] };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ===== GETTERS =====
function getBoards(data) {
  return [...data.boards].sort((a, b) => a.position - b.position);
}

function getLists(data, boardId) {
  return data.lists.filter(l => l.boardId === boardId).sort((a, b) => a.position - b.position);
}

function getCards(data, listId) {
  return data.cards.filter(c => c.listId === listId).sort((a, b) => a.position - b.position);
}

function getLabels(data, boardId) {
  return data.labels.filter(l => l.boardId === boardId);
}

function getCardLabelIds(data, cardId) {
  return data.cardLabels.filter(cl => cl.cardId === cardId).map(cl => cl.labelId);
}

function nextPosition(arr) {
  if (!arr.length) return 1000;
  return Math.max(...arr.map(x => x.position)) + 1000;
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== ROUTING =====
function getRoute() {
  const hash = location.hash.slice(1) || '/';
  const boardMatch = hash.match(/^\/board\/([^/]+)/);
  if (boardMatch) return { page: 'board', boardId: boardMatch[1] };
  return { page: 'home' };
}

function navigate(hash) {
  location.hash = hash;
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);

function render() {
  const route = getRoute();
  if (route.page === 'board') {
    renderBoard(route.boardId);
  } else {
    renderHome();
  }
}

// ===== HOME =====
function renderHome() {
  const data = loadData();
  const boards = getBoards(data);
  const app = document.getElementById('app');

  const cards = boards.map(b => `
    <div class="board-card" style="background:linear-gradient(135deg,${escHtml(b.color||'#0079bf')},${darken(b.color||'#0079bf')})" onclick="navigate('#/board/${escHtml(b.id)}')">
      <div class="board-card-title">${escHtml(b.title)}</div>
      <div class="board-card-actions">
        <button onclick="event.stopPropagation();editBoardName('${escHtml(b.id)}')">編集</button>
        <button onclick="event.stopPropagation();deleteBoard('${escHtml(b.id)}')">削除</button>
      </div>
    </div>
  `).join('');

  app.innerHTML = `
    <div class="home">
      <div class="home-title">ボード一覧</div>
      <div class="board-grid">
        ${cards}
        <button class="board-new" onclick="createBoard()">＋ 新しいボードを追加</button>
      </div>
    </div>
  `;
}

function darken(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 30);
  const g = Math.max(0, ((n >> 8) & 0xff) - 30);
  const b = Math.max(0, (n & 0xff) - 30);
  return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')}`;
}

// ===== BOARD CRUD =====
function createBoard() {
  const title = prompt('ボード名を入力してください');
  if (!title || !title.trim()) return;
  const data = loadData();
  const colors = ['#0079bf','#d29034','#519839','#b04632','#89609e','#cd5a91','#4bbf6b','#00aecc'];
  const color = colors[data.boards.length % colors.length];
  data.boards.push({ id: genId(), title: title.trim(), color, position: nextPosition(data.boards) });
  saveData(data);
  renderHome();
}

function editBoardName(boardId) {
  const data = loadData();
  const board = data.boards.find(b => b.id === boardId);
  if (!board) return;
  const newTitle = prompt('新しいボード名を入力してください', board.title);
  if (!newTitle || !newTitle.trim()) return;
  board.title = newTitle.trim();
  saveData(data);
  renderHome();
}

function deleteBoard(boardId) {
  if (!confirm('このボードを削除しますか？（リスト・カードもすべて削除されます）')) return;
  const data = loadData();
  const listIds = data.lists.filter(l => l.boardId === boardId).map(l => l.id);
  const cardIds = data.cards.filter(c => listIds.includes(c.listId)).map(c => c.id);
  data.boards = data.boards.filter(b => b.id !== boardId);
  data.lists = data.lists.filter(l => l.boardId !== boardId);
  data.cards = data.cards.filter(c => !listIds.includes(c.listId));
  data.labels = data.labels.filter(l => l.boardId !== boardId);
  data.cardLabels = data.cardLabels.filter(cl => !cardIds.includes(cl.cardId));
  saveData(data);
  renderHome();
}

// ===== BOARD VIEW =====
function renderBoard(boardId) {
  const data = loadData();
  const board = data.boards.find(b => b.id === boardId);
  if (!board) { navigate('#/'); return; }

  const lists = getLists(data, boardId);
  const listsHtml = lists.map(l => renderListHtml(data, l)).join('');

  document.getElementById('app').innerHTML = `
    <div class="board-view">
      <div class="board-header">
        <a href="#/" class="btn btn-ghost" style="text-decoration:none;font-size:13px;">← 戻る</a>
        <span class="board-name-display" onclick="inlineBoardEdit('${escHtml(board.id)}')">${escHtml(board.title)}</span>
        <div class="board-header-actions">
          <button class="btn btn-ghost" onclick="addList('${escHtml(board.id)}')">＋ リストを追加</button>
        </div>
      </div>
      <div class="board-lists" id="board-lists">
        ${listsHtml}
      </div>
    </div>
  `;

  bindDragEvents();
}

function inlineBoardEdit(boardId) {
  const el = document.querySelector('.board-name-display');
  if (!el) return;
  const data = loadData();
  const board = data.boards.find(b => b.id === boardId);
  if (!board) return;
  const input = document.createElement('input');
  input.value = board.title;
  input.style.cssText = 'flex:1;padding:4px 8px;border:2px solid #fff;border-radius:4px;font-size:20px;font-weight:700;background:rgba(255,255,255,.2);color:#fff;font-family:inherit';
  el.replaceWith(input);
  input.focus(); input.select();
  function finish() {
    const val = input.value.trim();
    if (val) {
      board.title = val;
      saveData(data);
    }
    renderBoard(boardId);
  }
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') finish(); if (e.key === 'Escape') renderBoard(boardId); });
}

function renderListHtml(data, list) {
  const cards = getCards(data, list.id);
  const cardsHtml = cards.map(c => renderCardHtml(data, c)).join('');
  return `
    <div class="list" data-list-id="${escHtml(list.id)}">
      <div class="list-header">
        <span class="list-title" ondblclick="editListTitle('${escHtml(list.id)}')">${escHtml(list.title)}</span>
        <button class="btn-icon" onclick="deleteList('${escHtml(list.id)}')" title="リストを削除">✕</button>
      </div>
      <div class="list-cards" data-cards-for="${escHtml(list.id)}" ondragover="event.preventDefault();this.classList.add('drag-over')" ondragleave="this.classList.remove('drag-over')" ondrop="onDrop(event,'${escHtml(list.id)}')">
        ${cardsHtml}
      </div>
      <div class="list-footer">
        <button class="btn-add" onclick="showAddCard('${escHtml(list.id)}')">＋ カードを追加</button>
      </div>
    </div>
  `;
}

function renderCardHtml(data, card) {
  const labelIds = getCardLabelIds(data, card.id);
  const labelsHtml = labelIds.map(lid => {
    const label = data.labels.find(l => l.id === lid);
    if (!label) return '';
    return `<span class="card-label" style="background:${escHtml(label.color)}">${escHtml(label.name)}</span>`;
  }).join('');

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue = card.dueDate && card.dueDate < today;

  const priorityHtml = card.priority
    ? `<span class="priority-badge priority-${escHtml(card.priority)}">${card.priority === 'HIGH' ? '高' : card.priority === 'MEDIUM' ? '中' : '低'}</span>`
    : '';
  const dueHtml = card.dueDate
    ? `<span class="due-badge ${isOverdue ? 'overdue' : ''}">📅 ${escHtml(card.dueDate)}</span>`
    : '';

  return `
    <div class="card" data-card-id="${escHtml(card.id)}" draggable="true">
      ${labelsHtml.length ? `<div class="card-labels">${labelsHtml}</div>` : ''}
      <div class="card-title">${escHtml(card.title)}</div>
      ${(priorityHtml || dueHtml) ? `<div class="card-meta">${priorityHtml}${dueHtml}</div>` : ''}
    </div>
  `;
}

// ===== LIST CRUD =====
function addList(boardId) {
  const title = prompt('リスト名を入力してください');
  if (!title || !title.trim()) return;
  const data = loadData();
  const lists = getLists(data, boardId);
  data.lists.push({ id: genId(), boardId, title: title.trim(), position: nextPosition(lists) });
  saveData(data);
  renderBoard(boardId);
}

function editListTitle(listId) {
  const data = loadData();
  const list = data.lists.find(l => l.id === listId);
  if (!list) return;
  const el = document.querySelector(`[data-list-id="${listId}"] .list-title`);
  if (!el) return;
  const input = document.createElement('input');
  input.className = 'list-title-input';
  input.value = list.title;
  el.replaceWith(input);
  input.focus(); input.select();
  function finish() {
    const val = input.value.trim();
    if (val) { list.title = val; saveData(data); }
    renderBoard(list.boardId);
  }
  input.addEventListener('blur', finish);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') finish(); if (e.key === 'Escape') renderBoard(list.boardId); });
}

function deleteList(listId) {
  if (!confirm('このリストを削除しますか？（カードもすべて削除されます）')) return;
  const data = loadData();
  const list = data.lists.find(l => l.id === listId);
  if (!list) return;
  const cardIds = data.cards.filter(c => c.listId === listId).map(c => c.id);
  data.lists = data.lists.filter(l => l.id !== listId);
  data.cards = data.cards.filter(c => c.listId !== listId);
  data.cardLabels = data.cardLabels.filter(cl => !cardIds.includes(cl.cardId));
  saveData(data);
  renderBoard(list.boardId);
}

// ===== ADD CARD QUICK FORM =====
let addCardSelectedLabels = new Set();

function showAddCard(listId) {
  addCardSelectedLabels = new Set();
  const data = loadData();
  const list = data.lists.find(l => l.id === listId);
  if (!list) return;
  const labels = getLabels(data, list.boardId);

  const labelsHtml = labels.map(l => `
    <span class="add-label-chip" data-label-id="${escHtml(l.id)}"
          style="background:${escHtml(l.color)}"
          onclick="toggleAddCardLabel('${escHtml(l.id)}', this)">${escHtml(l.name)}</span>
  `).join('');

  const footer = document.querySelector(`[data-list-id="${listId}"] .list-footer`);
  if (!footer) return;
  footer.innerHTML = `
    <div class="add-card-form">
      <input class="add-card-input" id="new-card-input-${escHtml(listId)}" placeholder="タイトル（必須）" type="text">
      <textarea class="add-card-desc" id="new-card-desc-${escHtml(listId)}" placeholder="説明（任意）" rows="2"></textarea>
      <div class="add-card-row">
        <select class="add-card-select" id="new-card-priority-${escHtml(listId)}">
          <option value="">優先度なし</option>
          <option value="HIGH">高 (HIGH)</option>
          <option value="MEDIUM">中 (MEDIUM)</option>
          <option value="LOW">低 (LOW)</option>
        </select>
        <input class="add-card-date" id="new-card-due-${escHtml(listId)}" type="date" title="期限日">
      </div>
      ${labels.length ? `<div class="add-label-row">${labelsHtml}</div>` : ''}
      <div class="add-card-actions">
        <button class="btn btn-primary" id="submit-card-${escHtml(listId)}">追加</button>
        <button class="btn-icon" id="cancel-card-${escHtml(listId)}">✕</button>
      </div>
    </div>
  `;
  const titleInput = document.getElementById(`new-card-input-${listId}`);
  const submitBtn = document.getElementById(`submit-card-${listId}`);
  const cancelBtn = document.getElementById(`cancel-card-${listId}`);
  if (!titleInput) return;
  titleInput.focus();
  titleInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); submitAddCard(listId); }
    if (e.key === 'Escape') cancelAddCard(listId);
  });
  submitBtn?.addEventListener('click', () => submitAddCard(listId));
  cancelBtn?.addEventListener('click', () => cancelAddCard(listId));
}

function toggleAddCardLabel(labelId, el) {
  if (addCardSelectedLabels.has(labelId)) {
    addCardSelectedLabels.delete(labelId);
    el.classList.remove('selected');
  } else {
    addCardSelectedLabels.add(labelId);
    el.classList.add('selected');
  }
}

function submitAddCard(listId) {
  const titleInput = document.getElementById(`new-card-input-${listId}`);
  if (!titleInput) return;
  const title = titleInput.value.trim();
  if (!title) { titleInput.focus(); return; }
  const description = document.getElementById(`new-card-desc-${listId}`)?.value || '';
  const priority = document.getElementById(`new-card-priority-${listId}`)?.value || '';
  const dueDate = document.getElementById(`new-card-due-${listId}`)?.value || '';
  const data = loadData();
  const list = data.lists.find(l => l.id === listId);
  if (!list) return;
  const cards = getCards(data, listId);
  const newCard = { id: genId(), listId, title, description, priority, dueDate, position: nextPosition(cards) };
  data.cards.push(newCard);
  for (const labelId of addCardSelectedLabels) {
    data.cardLabels.push({ cardId: newCard.id, labelId });
  }
  addCardSelectedLabels = new Set();
  saveData(data);
  renderBoard(list.boardId);
}

function cancelAddCard(listId) {
  const data = loadData();
  const list = data.lists.find(l => l.id === listId);
  if (!list) return;
  renderBoard(list.boardId);
}

// ===== CARD MODAL =====
let activeCardId = null;

function openCardModal(cardId) {
  activeCardId = cardId;
  refreshCardModal();
  document.getElementById('card-modal').classList.remove('hidden');
}

function refreshCardModal() {
  const data = loadData();
  const card = data.cards.find(c => c.id === activeCardId);
  if (!card) { closeCardModal(); return; }
  const labelIds = getCardLabelIds(data, card.id);

  const attachedLabelsHtml = labelIds.map(lid => {
    const label = data.labels.find(l => l.id === lid);
    if (!label) return '';
    return `<span class="label-chip" style="background:${escHtml(label.color)}">${escHtml(label.name)}<button class="remove-label" onclick="detachLabel('${escHtml(lid)}')">×</button></span>`;
  }).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label class="form-label">タイトル</label>
      <input class="form-input" id="edit-title" value="${escHtml(card.title)}">
    </div>
    <div class="form-group">
      <label class="form-label">説明</label>
      <textarea class="form-textarea" id="edit-desc">${escHtml(card.description || '')}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">優先度</label>
        <select class="form-select" id="edit-priority">
          <option value="" ${!card.priority ? 'selected' : ''}>なし</option>
          <option value="HIGH" ${card.priority === 'HIGH' ? 'selected' : ''}>高 (HIGH)</option>
          <option value="MEDIUM" ${card.priority === 'MEDIUM' ? 'selected' : ''}>中 (MEDIUM)</option>
          <option value="LOW" ${card.priority === 'LOW' ? 'selected' : ''}>低 (LOW)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">期限日</label>
        <input class="form-input" type="date" id="edit-due" value="${escHtml(card.dueDate || '')}">
      </div>
    </div>
    <div class="form-group card-labels-section">
      <label class="form-label">ラベル</label>
      <div class="attached-labels">${attachedLabelsHtml || '<span style="color:var(--text-light);font-size:13px">なし</span>'}</div>
      <button class="btn btn-light" onclick="openLabelModal()">ラベルを追加・管理</button>
    </div>
    <div class="modal-actions">
      <button class="btn btn-danger" onclick="deleteCard()">削除</button>
      <button class="btn btn-light" onclick="closeCardModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="saveCard()">保存</button>
    </div>
  `;
}

function saveCard() {
  const data = loadData();
  const card = data.cards.find(c => c.id === activeCardId);
  if (!card) return;
  card.title = document.getElementById('edit-title')?.value.trim() || card.title;
  card.description = document.getElementById('edit-desc')?.value || '';
  card.priority = document.getElementById('edit-priority')?.value || '';
  card.dueDate = document.getElementById('edit-due')?.value || '';
  saveData(data);
  closeCardModal();
  const list = data.lists.find(l => l.id === card.listId);
  if (list) renderBoard(list.boardId);
}

function deleteCard() {
  if (!confirm('このカードを削除しますか？')) return;
  const data = loadData();
  const card = data.cards.find(c => c.id === activeCardId);
  if (!card) return;
  const list = data.lists.find(l => l.id === card.listId);
  data.cards = data.cards.filter(c => c.id !== activeCardId);
  data.cardLabels = data.cardLabels.filter(cl => cl.cardId !== activeCardId);
  saveData(data);
  closeCardModal();
  if (list) renderBoard(list.boardId);
}

function closeCardModal() {
  document.getElementById('card-modal').classList.add('hidden');
  activeCardId = null;
}

document.getElementById('modal-close')?.addEventListener('click', closeCardModal);
document.getElementById('card-modal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeCardModal();
});

// ===== LABEL MODAL =====
function openLabelModal() {
  const data = loadData();
  const card = data.cards.find(c => c.id === activeCardId);
  if (!card) return;
  const list = data.lists.find(l => l.id === card.listId);
  const board = list ? data.boards.find(b => b.id === list.boardId) : null;
  if (!board) return;

  const labels = getLabels(data, board.id);
  const attachedIds = getCardLabelIds(data, card.id);

  const items = labels.map(label => {
    const isAttached = attachedIds.includes(label.id);
    return `
      <div class="label-item ${isAttached ? 'selected' : ''}" onclick="toggleLabel('${escHtml(label.id)}')">
        <span class="label-dot" style="background:${escHtml(label.color)}"></span>
        <span class="label-name">${escHtml(label.name)}</span>
        ${isAttached ? '<span class="label-check">✓</span>' : ''}
      </div>
    `;
  }).join('') || '<p style="color:var(--text-light);font-size:13px;margin-bottom:12px">ラベルがまだありません</p>';

  document.getElementById('label-modal-body').innerHTML = `
    <div class="label-list">${items}</div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
      <button class="btn btn-primary" onclick="openLabelCreateModal('${escHtml(board.id)}')">＋ 新しいラベルを作成</button>
    </div>
  `;

  document.getElementById('label-modal').classList.remove('hidden');
}

function toggleLabel(labelId) {
  const data = loadData();
  const idx = data.cardLabels.findIndex(cl => cl.cardId === activeCardId && cl.labelId === labelId);
  if (idx >= 0) {
    data.cardLabels.splice(idx, 1);
  } else {
    data.cardLabels.push({ cardId: activeCardId, labelId });
  }
  saveData(data);
  openLabelModal();
  refreshCardModal();
}

function detachLabel(labelId) {
  const data = loadData();
  data.cardLabels = data.cardLabels.filter(cl => !(cl.cardId === activeCardId && cl.labelId === labelId));
  saveData(data);
  refreshCardModal();
}

function closeLabelModal() {
  document.getElementById('label-modal').classList.add('hidden');
}

document.getElementById('label-modal-close')?.addEventListener('click', closeLabelModal);
document.getElementById('label-modal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLabelModal();
});

// ===== LABEL CREATE MODAL =====
const LABEL_COLORS = [
  '#61bd4f','#f2a54a','#eb5a46','#c377e0','#0079bf',
  '#00c2e0','#51e898','#ff9f1a','#344563','#b3bac5',
  '#cd5a91','#4bbf6b','#89609e','#d29034','#519839'
];

let createLabelBoardId = null;
let selectedColor = LABEL_COLORS[0];

function openLabelCreateModal(boardId) {
  createLabelBoardId = boardId;
  selectedColor = LABEL_COLORS[0];

  const swatches = LABEL_COLORS.map(c => `
    <div class="color-swatch ${c === selectedColor ? 'selected' : ''}"
      style="background:${c}"
      data-color="${c}"
      onclick="selectColor('${c}')">
    </div>
  `).join('');

  document.getElementById('label-create-body').innerHTML = `
    <div class="form-group">
      <label class="form-label">ラベル名</label>
      <input class="form-input" id="new-label-name" placeholder="例: 重要、バグ、機能" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">カラー</label>
      <div class="color-swatches" id="color-swatches">${swatches}</div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-light" onclick="closeLabelCreateModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitCreateLabel()">作成</button>
    </div>
  `;

  document.getElementById('label-create-modal').classList.remove('hidden');
}

function selectColor(color) {
  selectedColor = color;
  document.querySelectorAll('.color-swatch').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === color);
  });
}

function submitCreateLabel() {
  const name = document.getElementById('new-label-name')?.value.trim();
  if (!name) { alert('ラベル名を入力してください'); return; }
  const data = loadData();
  data.labels.push({ id: genId(), boardId: createLabelBoardId, name, color: selectedColor });
  saveData(data);
  closeLabelCreateModal();
  openLabelModal();
}

function closeLabelCreateModal() {
  document.getElementById('label-create-modal').classList.add('hidden');
}

document.getElementById('label-create-close')?.addEventListener('click', closeLabelCreateModal);
document.getElementById('label-create-modal')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLabelCreateModal();
});

// ===== DRAG & DROP =====
let dragCardId = null;
let didDrag = false;

function bindDragEvents() {
  document.querySelectorAll('.card').forEach(el => {
    el.addEventListener('dragstart', e => {
      dragCardId = el.dataset.cardId;
      didDrag = true;
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      document.querySelectorAll('.list-cards').forEach(c => c.classList.remove('drag-over'));
      // dragend の直後に click が来るので少し待ってからフラグをリセット
      setTimeout(() => { didDrag = false; }, 50);
    });
    el.addEventListener('click', () => {
      if (didDrag) return;
      openCardModal(el.dataset.cardId);
    });
  });
}

function onDrop(e, targetListId) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragCardId) return;

  const data = loadData();
  const card = data.cards.find(c => c.id === dragCardId);
  if (!card) return;

  const dropTarget = e.currentTarget;
  const cards = [...dropTarget.querySelectorAll('.card:not(.dragging)')];
  let newPosition;

  if (!cards.length) {
    newPosition = 1000;
  } else {
    const targetCard = getDropTargetCard(e, cards);
    if (targetCard) {
      const targetCardData = data.cards.find(c => c.id === targetCard.dataset.cardId);
      const targetPos = targetCardData ? targetCardData.position : 1000;
      const siblings = getCards(data, targetListId).filter(c => c.id !== dragCardId);
      const idx = siblings.findIndex(c => c.id === targetCard.dataset.cardId);
      const prev = siblings[idx - 1];
      newPosition = prev ? (prev.position + targetPos) / 2 : targetPos - 500;
    } else {
      const lastCard = data.cards.find(c => c.id === cards[cards.length - 1].dataset.cardId);
      newPosition = (lastCard ? lastCard.position : 0) + 1000;
    }
  }

  card.listId = targetListId;
  card.position = newPosition;
  saveData(data);

  const list = data.lists.find(l => l.id === targetListId);
  if (list) renderBoard(list.boardId);
  dragCardId = null;
}

function getDropTargetCard(e, cardEls) {
  const mouseY = e.clientY;
  for (const el of cardEls) {
    const rect = el.getBoundingClientRect();
    if (mouseY < rect.top + rect.height / 2) return el;
  }
  return null;
}

// ===== INIT =====
render();
