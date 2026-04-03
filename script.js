/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
function showPage(id, navEl) {
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (navEl) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    navEl.classList.add('active');
  }
  const titles = {
    home: 'Home — Kaushal Saathi',
    dashboard: 'Dashboard', lessonplan: 'AI Lesson Plan Generator',
    assessments: 'Assessments', timetable: 'Smart Timetable',
    chat: 'Chat with AI', notifications: 'Important Notifications',
    gamified: 'Gamified Zone', stories: 'Success Stories',
    reports: 'Generate Report', projects: 'Projects',
    content: 'Content Repository', subjects: 'Subject Integration',
    fieldvisits: 'Field Visits & Guest Lectures'
  };
  document.getElementById('page-title').textContent = titles[id] || id;

  // Hide sidebar & topbar on home page; show on all other pages
  const sidebar = document.getElementById('sidebar');
  const mainEl = document.querySelector('.main');
  const topbar = document.querySelector('.topbar');
  if (id === 'home') {
    sidebar.style.display = 'none';
    mainEl.style.marginLeft = '0';
    if (topbar) topbar.style.display = 'none';
  } else {
    sidebar.style.display = '';
    mainEl.style.marginLeft = '';
    if (topbar) topbar.style.display = '';
  }

  if (id === 'timetable') updateTimetable();
}

/* ══════════════════════════════════════
   ASSESSMENT PANEL
══════════════════════════════════════ */
function selectAssessment(el, type) {
  document.querySelectorAll('.assessment-type').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  document.querySelectorAll('.as-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('as-' + type);
  if (panel) panel.classList.add('active');
}

function generateAutoReport(type) {
  const reportEl = document.getElementById('report-' + type);
  if (reportEl) {
    reportEl.style.display = 'block';
    reportEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function calcTotal(input) {
  const row = input.closest('tr');
  if (!row) return;
  const inputs = Array.from(row.querySelectorAll('.score-input'));
  let sum = 0, valid = true;
  inputs.forEach(i => {
    const v = parseFloat(i.value);
    if (i.value === '' || isNaN(v)) valid = false;
    else sum += v;
  });
  const total = row.querySelector('.score-total');
  if (total) {
    if (!valid) { total.textContent = '—'; return; }
    const maxEl = row.closest('table').querySelector('thead tr th:last-child');
    const maxText = maxEl ? maxEl.textContent.match(/\d+/) : null;
    total.textContent = maxText ? sum + '/' + maxText[0] : sum;
  }
}

/* ══════════════════════════════════════
   LESSON PLAN WIZARD STATE
══════════════════════════════════════ */
const wizardState = {
  planType: 'project',
  grade: '', topic: '', project: '', activity: '',
  activityName: '', sections: [], showCustom: false
};

const projectMap = {
  life:     ['School Kitchen Garden','Biodiversity Register','Sprout Lab'],
  machines: ['Maker Skills Workshop','Simple Machines Model','Upcycled Gadget'],
  human:    ['Community Service Project','Local Market Study','Health & Hygiene Drive']
};

const activityMap = {
  'School Kitchen Garden': [
    {n:'Activity 1',title:'Garden Planning & Layout',tag:'Planning'},
    {n:'Activity 2',title:'Soil Preparation',tag:'Hands-on'},
    {n:'Activity 3',title:'Vermicomposting',tag:'Science'},
    {n:'Activity 4',title:'Seed Sowing',tag:'Practice'},
    {n:'Activity 5',title:'Watering & Care',tag:'Daily'},
    {n:'Activity 6',title:'Composting Basics',tag:'Science'},
    {n:'Activity 7',title:'Plant Height Measurement',tag:'Maths'},
    {n:'Activity 8',title:'Pest Identification',tag:'Biology'},
    {n:'Activity 9',title:'Harvest & Documentation',tag:'Project'},
    {n:'Activity 10',title:'Garden Exhibition',tag:'Showcase'},
  ],
  'Biodiversity Register': [
    {n:'Activity 1',title:'Introduce Biodiversity Concepts',tag:'Theory'},
    {n:'Activity 2',title:'Local Bird Survey',tag:'Fieldwork'},
    {n:'Activity 3',title:'Insect Identification Walk',tag:'Fieldwork'},
    {n:'Activity 4',title:'Tree Tagging & Census',tag:'Science'},
    {n:'Activity 5',title:'Water Body Study',tag:'Ecology'},
    {n:'Activity 6',title:'Register Documentation',tag:'Project'},
  ],
  'Maker Skills Workshop': [
    {n:'Activity 1',title:'Design Thinking Intro',tag:'Theory'},
    {n:'Activity 2',title:'Prototype Building',tag:'Hands-on'},
    {n:'Activity 3',title:'Material Testing',tag:'Science'},
    {n:'Activity 4',title:'Maker Fair Showcase',tag:'Project'},
  ]
};

function selectPlanType(el, type) {
  document.querySelectorAll('.plan-type-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  wizardState.planType = type;
}

function updateContext() {
  const g = document.getElementById('sel-class');
  const p = document.getElementById('sel-project');
  if (g) wizardState.grade = g.value ? 'Grade ' + g.value : 'Grade 6';
  if (p) wizardState.project = p.value || 'Kitchen Garden';
  const cg = document.getElementById('ctx-grade');
  if (cg) cg.textContent = wizardState.grade || 'Grade 6';
}

function updateProjectList() {
  const topicEl = document.getElementById('sel-topic');
  const projEl  = document.getElementById('sel-project');
  if (!topicEl || !projEl) return;
  wizardState.topic = topicEl.value;
  const projects = projectMap[wizardState.topic] || [];
  projEl.innerHTML = '<option value="">Select Project</option>';
  projects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    projEl.appendChild(opt);
  });
  const tEl = document.getElementById('ctx-topic');
  const labels = {life:'Work with Life Forms', machines:'Machines & Materials', human:'Human Services'};
  if (tEl) tEl.textContent = labels[wizardState.topic] || 'Select Topic';
}

function goToStep(n) {
  for (let i = 1; i <= 5; i++) {
    const sp = document.getElementById('sp' + i);
    const sw = document.getElementById('sw' + i);
    if (sp) sp.classList.toggle('active', i === n);
    if (sw) {
      sw.classList.remove('active','done');
      if (i < n) sw.classList.add('done');
      else if (i === n) sw.classList.add('active');
    }
  }
  if (n === 2) populateActivities();
  if (n === 5) updateFinalCtxBar();
}

function populateActivities() {
  const list = document.getElementById('activity-list');
  if (!list) return;
  const proj = wizardState.project || 'School Kitchen Garden';
  const activities = activityMap[proj] || activityMap['School Kitchen Garden'];
  list.innerHTML = '';
  activities.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `<div class="activity-num">${i+1}</div><div class="activity-info"><h4>${a.n}: ${a.title}</h4><p>35 min · Hands-on activity</p></div><span class="activity-tag">${a.tag}</span>`;
    div.onclick = () => {
      document.querySelectorAll('.activity-item').forEach(x => x.classList.remove('selected'));
      div.classList.add('selected');
      wizardState.activity = a.n;
      wizardState.activityName = a.title;
      const el = document.getElementById('ctx-activity-name');
      if (el) el.textContent = a.n + ': ' + a.title;
    };
    list.appendChild(div);
  });
}

function toggleChip(el, key) {
  document.getElementById('chip-full').classList.remove('selected');
  el.classList.toggle('selected');
  const idx = wizardState.sections.indexOf(key);
  if (idx > -1) wizardState.sections.splice(idx, 1);
  else wizardState.sections.push(key);
}

function selectFullPlan(el) {
  document.querySelectorAll('.section-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  wizardState.sections = ['objective','materials','intro','activity','group','discussion','conclusion','assessment'];
}

function goToNextFromStep3() {
  if (wizardState.planType === 'custom') {
    document.getElementById('sw4').style.display = '';
    goToStep(4);
  } else {
    goToStep(5);
  }
}

function goBackFromStep5() {
  if (wizardState.planType === 'custom') goToStep(4);
  else goToStep(3);
}

function updateFinalCtxBar() {
  const bar = document.getElementById('final-ctx-bar');
  if (!bar) return;
  const dur = document.getElementById('sel-duration');
  const stu = document.getElementById('inp-students');
  const d = dur ? dur.value : '35 min (1 Period)';
  const s = stu ? stu.value : '35';
  bar.innerHTML = `<strong>${wizardState.grade || 'Grade 6'}</strong> <span class="ctx-sep">·</span> ${wizardState.project || 'Kitchen Garden'} <span class="ctx-sep">·</span> ${wizardState.activity || 'Activity 4'}: ${wizardState.activityName || 'Seed Sowing'} <span class="ctx-sep">·</span> ${d} <span class="ctx-sep">·</span> ${s} students`;
}

function resetWizard() {
  wizardState.planType = 'project';
  wizardState.grade = ''; wizardState.topic = ''; wizardState.project = '';
  wizardState.activity = ''; wizardState.activityName = '';
  wizardState.sections = [];
  document.querySelectorAll('.plan-type-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('pt-project').classList.add('selected');
  document.querySelectorAll('.section-chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('output-area').classList.remove('visible');
  document.getElementById('sw4').style.display = 'none';
}

/* ══════════════════════════════════════
   AI LESSON PLAN GENERATOR
══════════════════════════════════════ */
let currentPlanContent = '';

async function generateLessonPlan() {
  const btn = document.getElementById('gen-btn');
  const btnText = document.getElementById('gen-btn-text');
  const outputArea = document.getElementById('output-area');
  const outputBody = document.getElementById('output-body');
  const outputLoading = document.getElementById('output-loading');

  btn.disabled = true;
  btnText.textContent = 'Generating with AI…';
  outputArea.classList.add('visible');
  outputLoading.style.display = 'flex';
  outputBody.innerHTML = '<div class="output-loading" id="output-loading"><div class="loading-dots"><span></span><span></span><span></span></div> Generating your lesson plan with AI…</div>';
  outputArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const grade = wizardState.grade || 'Grade 6';
  const project = wizardState.project || 'School Kitchen Garden';
  const activity = (wizardState.activity || 'Activity 4') + ': ' + (wizardState.activityName || 'Seed Sowing');
  const sections = wizardState.sections.length ? wizardState.sections.join(', ') : 'Full Lesson Plan';
  const duration = document.getElementById('sel-duration') ? document.getElementById('sel-duration').value : '35 min';
  const level = document.getElementById('sel-level') ? document.getElementById('sel-level').value : 'Intermediate';
  const students = document.getElementById('inp-students') ? document.getElementById('inp-students').value : '35';
  const language = document.getElementById('sel-language') ? document.getElementById('sel-language').value : 'English';
  const notes = document.getElementById('inp-notes') ? document.getElementById('inp-notes').value : '';

  const prompt = `You are an experienced NEP 2020 curriculum expert for Indian schools. Generate a detailed, structured lesson plan with the following details:

Grade: ${grade}
Project: ${project}
Activity: ${activity}
Sections to include: ${sections}
Duration: ${duration}
Student Level: ${level}
Number of Students: ${students}
Language of Instruction: ${language}
Additional Notes: ${notes || 'None'}

Format the response as a beautiful, structured lesson plan with clear HTML formatting using <h4> tags for section headers and <ul>/<ol> for lists. Include:
- A brief overview line
- Learning Objectives (3-4 points)
- Materials Required (bullet list)
- Step-by-step Activity Instructions (numbered)
- Group Work / Discussion Questions (if applicable)
- Assessment ideas
- Teacher Tips
- Cross-subject connections (Maths, Language, Social Science links)

Keep it practical, hands-on, and aligned with NEP 2020 competency-based learning. Use simple, clear language appropriate for Indian government school teachers.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    let content = data.content && data.content[0] ? data.content[0].text : '';

    // Clean markdown formatting
    content = content
      .replace(/```html?/gi, '').replace(/```/g, '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^## (.+)$/gm, '<h4>$1</h4>')
      .replace(/^# (.+)$/gm, '<h4>$1</h4>')
      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    currentPlanContent = content;
    outputBody.innerHTML = `<div class="output-loading" id="output-loading" style="display:none"></div><p>${content}</p>`;
    document.getElementById('output-title').textContent = `${activity} — Lesson Plan`;
    document.getElementById('output-meta').textContent = `${grade} · ${project} · ${duration}`;

  } catch (err) {
    // Fallback to rich static plan
    currentPlanContent = buildFallbackPlan(grade, project, activity, duration, students);
    outputBody.innerHTML = currentPlanContent;
  }

  btn.disabled = false;
  btnText.textContent = '✨ Generate Lesson Plan with AI';
}

function buildFallbackPlan(grade, project, activity, duration, students) {
  return `
<h4>📋 Lesson Overview</h4>
<p><strong>${grade} · ${project} · ${activity}</strong><br>
Duration: ${duration} · Students: ${students} · NEP 2020 Aligned — Competency-Based Learning</p>

<h4>🎯 Learning Objectives</h4>
<ul>
  <li>Students will understand the step-by-step process of seed germination and growth</li>
  <li>Students will develop observation skills through a 7-day monitoring activity</li>
  <li>Students will connect science concepts (nutrients, soil, water) with practical gardening</li>
  <li>Students will document findings using scientific vocabulary in their activity books</li>
</ul>

<h4>🧰 Materials Required</h4>
<ul>
  <li>Seeds (moong/chana/fenugreek) — 3 per student</li>
  <li>Small pots or plastic cups with drainage holes</li>
  <li>Garden soil + compost mix (from Activity 3 vermicompost)</li>
  <li>Watering cans, measuring scale, rulers</li>
  <li>Observation diary / activity book</li>
  <li>Labels and markers</li>
</ul>

<h4>🔬 Step-by-Step Activity</h4>
<ol>
  <li><strong>Introduction (5 min):</strong> Ask — "Where does our food come from?" Connect to previous lessons on soil.</li>
  <li><strong>Demonstration (5 min):</strong> Teacher demonstrates soil filling, seed placement, and watering technique.</li>
  <li><strong>Hands-On Activity (15 min):</strong> Each student fills pot with soil mix, plants 2-3 seeds at 1cm depth, labels pot with name and date.</li>
  <li><strong>First Observation (5 min):</strong> Students draw the seed in their book, record soil type and quantity of water used.</li>
  <li><strong>Discussion & Wrap-up (5 min):</strong> Ask — "What do seeds need to grow?" Record predictions for next 7 days.</li>
</ol>

<h4>👥 Group Work / Discussion Questions</h4>
<ul>
  <li>Why do seeds need water but not too much water?</li>
  <li>What will happen if we plant seeds in sandy soil without compost?</li>
  <li>How are seeds from different plants different from each other?</li>
</ul>

<h4>📝 Assessment</h4>
<p>Daily observation diary (7 days) — students record height, colour, changes. 
Final: draw and label a germinated seedling showing root, shoot, cotyledon.</p>

<h4>💡 Teacher Tips</h4>
<ul>
  <li>Keep pots near window for natural sunlight</li>
  <li>Pair slower learners with confident students for peer support</li>
  <li>Connect to Maths: measure plant height daily — create a bar graph of growth</li>
</ul>

<h4>🔗 Cross-Subject Connections</h4>
<ul>
  <li><em>Maths:</em> Measurement, graphs, ratios (soil:compost mix)</li>
  <li><em>Language:</em> Observation journal writing, new vocabulary (germination, cotyledon)</li>
  <li><em>Social Science:</em> Farming communities, food production in India</li>
</ul>`;
}

async function refinePlan(prompt) {
  const outputBody = document.getElementById('output-body');
  if (!currentPlanContent) return;
  outputBody.innerHTML = '<div class="output-loading"><div class="loading-dots"><span></span><span></span><span></span></div> Refining your plan…</div>';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: 'Here is the current lesson plan:\n\n' + currentPlanContent },
          { role: 'assistant', content: currentPlanContent },
          { role: 'user', content: prompt + '\n\nKeep the same HTML structure format.' }
        ]
      })
    });

    const data = await response.json();
    let content = data.content && data.content[0] ? data.content[0].text : currentPlanContent;
    content = content.replace(/```html?/gi,'').replace(/```/g,'')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/^#{1,3} (.+)$/gm,'<h4>$1</h4>')
      .replace(/^\- (.+)$/gm,'<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm,'<li>$1</li>')
      .replace(/\n\n/g,'</p><p>').replace(/\n/g,'<br>');
    currentPlanContent = content;
    outputBody.innerHTML = `<p>${content}</p>`;
  } catch {
    outputBody.innerHTML = `<p>${currentPlanContent}</p>`;
  }
}

function copyOutput() {
  const body = document.getElementById('output-body');
  const text = body ? body.innerText : '';
  navigator.clipboard.writeText(text).then(() => alert('✅ Lesson plan copied to clipboard!')).catch(() => alert('Copy failed. Please select text manually.'));
}

function printOutput() {
  const body = document.getElementById('output-body');
  const title = document.getElementById('output-title');
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Lesson Plan</title><style>body{font-family:sans-serif;padding:30px;max-width:800px;margin:auto}h4{color:#C84B2F}ul,ol{margin:8px 0;padding-left:20px}li{margin-bottom:4px}em{color:#C84B2F;font-style:normal;font-weight:600}</style></head><body><h2>${title ? title.textContent : 'Lesson Plan'}</h2>${body ? body.innerHTML : ''}</body></html>`);
  w.document.close(); w.print();
}

/* ══════════════════════════════════════
   CHAT
══════════════════════════════════════ */
const aiReplies = [
  "Great question! For germination, I'd suggest starting with a simple observation activity. Give each student 3 seeds (moong or chana work well), a wet cotton ball, and a small container. Ask them to observe and record daily changes over 5 days. This connects directly to your Kitchen Garden Activity 4!",
  "For hands-on activities, the best strategy is the <strong>Inquiry-Based Learning</strong> approach: 1) Pose a question (Why do plants need water?), 2) Students predict, 3) Do the activity, 4) Compare with prediction. This builds scientific thinking naturally.",
  "Here are 5 MCQ questions for Activity 3: 1) What do earthworms add to soil? (a) Sand (b) Nutrients ✓ (c) Clay (d) Rocks. Want me to generate the full worksheet PDF?",
  "For connecting Kitchen Garden to Maths, try Activity 2 (Soil Prep): Ask students to measure the garden plot (length × breadth) to find the area. Then calculate how many plants fit if each needs 30cm spacing. This covers Mensuration directly from the Grade 6 syllabus!"
];
let replyIdx = 0;

function sendChat() {
  const input = document.getElementById('chat-input');
  const val = input.value.trim();
  if (!val) return;
  addMsg(val, 'user');
  input.value = '';
  const typing = document.createElement('div');
  typing.className = 'msg ai';
  typing.innerHTML = '<div class="msg-label">Kaushal Saathi AI</div><div class="msg-bubble"><div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  document.getElementById('chat-messages').appendChild(typing);
  scrollChat();
  setTimeout(() => {
    typing.remove();
    addMsg(aiReplies[replyIdx % aiReplies.length], 'ai');
    replyIdx++;
  }, 1500);
}

function sendPrompt(text) {
  showPage('chat', null);
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.textContent.trim().startsWith('Chat')) n.classList.add('active');
    else n.classList.remove('active');
  });
  document.getElementById('chat-input').value = text;
  sendChat();
}

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.innerHTML = `<div class="msg-label">${role === 'ai' ? 'Kaushal Saathi AI' : 'You'}</div><div class="msg-bubble">${text}</div>`;
  document.getElementById('chat-messages').appendChild(div);
  scrollChat();
}

function scrollChat() {
  const c = document.getElementById('chat-messages');
  if (c) c.scrollTop = c.scrollHeight;
}

/* ══════════════════════════════════════
   CONTENT REPOSITORY
══════════════════════════════════════ */
function switchCRTab(tab, el) {
  document.querySelectorAll('.cr-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cr-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cr-' + tab).classList.add('active');
}

/* ══════════════════════════════════════
   SUBJECT INTEGRATION
══════════════════════════════════════ */
function selectSISession(el, session) {
  document.querySelectorAll('.si-session-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.si-content').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('si-' + session).classList.add('active');
}

/* ══════════════════════════════════════
   SMART TIMETABLE
══════════════════════════════════════ */
const termTopics = {
  1: {name:'Kitchen Garden', color:'var(--sage)', topics:[
    {t:'Introduction to Plants & Soil',type:'theory',pri:'High'},
    {t:'Soil Preparation Activity',type:'activity',pri:'High'},
    {t:'Seed Sowing Practical',type:'activity',pri:'High'},
    {t:'Vermicomposting',type:'activity',pri:'Medium'},
    {t:'Nutrient Cycle – Theory',type:'theory',pri:'High'},
    {t:'Germination Observation',type:'project',pri:'High'},
    {t:'Pest Management',type:'theory',pri:'Medium'},
    {t:'Water Management',type:'theory',pri:'Medium'},
    {t:'Plant Measurement & Data',type:'project',pri:'Medium'},
    {t:'Harvest & Documentation',type:'project',pri:'Low'},
    {t:'Garden Exhibition Prep',type:'project',pri:'Low'},
  ]},
  2: {name:'Biodiversity Register', color:'var(--sky)', topics:[
    {t:'Introduction to Biodiversity',type:'theory',pri:'High'},
    {t:'Classification of Living Things',type:'theory',pri:'High'},
    {t:'Local Bird Survey',type:'activity',pri:'High'},
    {t:'Insect Identification',type:'activity',pri:'High'},
    {t:'Tree Census Walk',type:'activity',pri:'Medium'},
    {t:'Ecosystem Relationships',type:'theory',pri:'High'},
    {t:'Field Documentation Skills',type:'project',pri:'Medium'},
    {t:'Biodiversity Register Entry',type:'project',pri:'High'},
    {t:'Threat to Biodiversity',type:'theory',pri:'Medium'},
    {t:'Conservation Strategies',type:'theory',pri:'Medium'},
    {t:'Final Register Presentation',type:'project',pri:'Low'},
  ]},
  3: {name:'Maker Skills', color:'var(--terracotta)', topics:[
    {t:'Design Thinking Intro',type:'theory',pri:'High'},
    {t:'Materials & Properties',type:'theory',pri:'High'},
    {t:'Simple Machines',type:'theory',pri:'High'},
    {t:'Prototype Building',type:'activity',pri:'High'},
    {t:'Measurement & Precision',type:'theory',pri:'Medium'},
    {t:'Material Testing Activity',type:'activity',pri:'High'},
    {t:'Upcycling & Sustainability',type:'theory',pri:'Medium'},
    {t:'Collaborative Making',type:'activity',pri:'Medium'},
    {t:'Safety in Making',type:'theory',pri:'Medium'},
    {t:'Maker Fair Preparation',type:'project',pri:'Low'},
    {t:'Maker Fair Showcase',type:'project',pri:'Low'},
  ]}
};

function updateTimetable() {
  const sylPct = parseInt(document.getElementById('tt-syllabus').value);
  const periods = parseInt(document.getElementById('tt-periods').value);
  const term = parseInt(document.getElementById('tt-term').value);

  document.getElementById('tt-syllabus-val').textContent = sylPct + '%';
  document.getElementById('tt-periods-val').textContent = periods;

  // Calculate used periods
  const totalPeriods = 63;
  const used = totalPeriods - periods;
  const usedPct = Math.round((used / totalPeriods) * 100);
  document.getElementById('t3-used').textContent = used;
  document.getElementById('t3-bar').style.width = usedPct + '%';
  document.getElementById('t3-info').innerHTML = `🔴 ${used}/${totalPeriods} used · ${periods} remaining · ${sylPct}% done`;
  document.getElementById('t3-sub').textContent = `periods used · ${termTopics[term].name}`;

  // Determine alert type
  const remaining = 100 - sylPct;
  const periodsPerTopic = periods > 0 ? (remaining / periods).toFixed(1) : 0;
  const alertBanner = document.getElementById('tt-alert-banner');
  const alertTitle = document.getElementById('tt-alert-title');
  const alertMsg = document.getElementById('tt-alert-msg');
  const scenarioLabel = document.getElementById('tt-scenario-label');

  let alertColor, alertIcon, alertTitleText, alertMsgText, scenarioText;

  if (periods <= 10 && remaining > 30) {
    alertColor = 'rgba(200,75,47,0.35)'; alertIcon = '🚨';
    alertTitleText = 'Critical: Very Few Periods for Remaining Syllabus!';
    alertMsgText = `Only ${periods} periods remain but ${remaining}% syllabus is pending. AI will merge topics and focus only on exam-critical content.`;
    scenarioText = `⚠️ <strong style="color:var(--terracotta)">Critical Scenario:</strong> ${remaining}% syllabus · Only ${periods} periods → Merged, priority-only schedule`;
  } else if (periods <= 25 && remaining > 40) {
    alertColor = 'rgba(200,75,47,0.25)'; alertIcon = '⚠️';
    alertTitleText = 'Compressed Schedule Needed';
    alertMsgText = `${remaining}% syllabus remains with ${periods} periods. AI prioritizes high-weightage topics and combines related activities.`;
    scenarioText = `📌 <strong style="color:var(--terracotta)">Compressed Scenario:</strong> ${remaining}% syllabus · ${periods} periods → Prioritized, compact schedule`;
  } else if (remaining <= 20) {
    alertColor = 'rgba(122,158,126,0.25)'; alertIcon = '✅';
    alertTitleText = 'Comfortable — Nearly Done!';
    alertMsgText = `Only ${remaining}% syllabus remains. ${periods} periods is sufficient for a comfortable completion with revision time.`;
    scenarioText = `✅ <strong style="color:var(--sage)">Relaxed Scenario:</strong> ${remaining}% syllabus · ${periods} periods → Normal pace with revision sessions`;
  } else {
    alertColor = 'rgba(91,141,184,0.2)'; alertIcon = '📊';
    alertTitleText = 'On Track — Steady Pace';
    alertMsgText = `${remaining}% syllabus with ${periods} periods available. Maintain current teaching pace with some buffer for activities.`;
    scenarioText = `📊 <strong style="color:var(--sky)">Normal Scenario:</strong> ${remaining}% syllabus · ${periods} periods → Steady pace with activities`;
  }

  alertBanner.style.background = alertColor;
  alertBanner.style.borderColor = alertColor.replace('0.25','0.5').replace('0.35','0.6').replace('0.2','0.4');
  alertTitle.textContent = alertTitleText;
  alertMsg.textContent = alertMsgText;
  scenarioLabel.innerHTML = scenarioText;

  regenerateSchedule(sylPct, periods, term, remaining);
  buildTypeTable(sylPct, periods);
  buildWeekly(periods);
  buildTips(sylPct, periods, remaining);
}

function regenerateSchedule(sylPct, periods, term, remaining) {
  if (sylPct === undefined) {
    sylPct = parseInt(document.getElementById('tt-syllabus').value);
    periods = parseInt(document.getElementById('tt-periods').value);
    term = parseInt(document.getElementById('tt-term').value);
    remaining = 100 - sylPct;
  }

  const tbody = document.getElementById('tt-schedule-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  const topics = termTopics[term].topics;
  // Filter based on syllabus completion
  const startIdx = Math.floor((sylPct / 100) * topics.length);
  const remaining_topics = topics.slice(startIdx);

  // Determine how many periods per topic
  const isCompressed = periods < remaining_topics.length * 3;
  let schedule = [];

  if (isCompressed) {
    // Compressed: merge low-priority topics
    remaining_topics.forEach((tp, i) => {
      if (tp.pri === 'High' || i < periods * 0.7) {
        schedule.push({...tp, periods: tp.type === 'theory' ? 1 : 2});
      } else if (schedule.length < periods - 2) {
        // Merge pending medium/low
        if (schedule.length > 0 && schedule[schedule.length-1].merged) {
          schedule[schedule.length-1].title += ' + ' + tp.t;
        } else {
          schedule.push({...tp, periods: 1, merged: true});
        }
      }
    });
    // Add revision + assessment
    if (schedule.length < periods) schedule.push({t:'Revision & Doubt Clearing',type:'theory',pri:'High',periods:1});
    if (schedule.length < periods) schedule.push({t:'Final Assessment',type:'project',pri:'High',periods:1});
  } else {
    remaining_topics.forEach(tp => {
      schedule.push({...tp, periods: tp.type === 'theory' ? 2 : 3});
    });
    schedule.push({t:'Revision Session',type:'theory',pri:'Medium',periods:2});
    schedule.push({t:'Assessment & Wrap-up',type:'project',pri:'High',periods:2});
  }

  let periodNum = (63 - periods) + 1;
  schedule.slice(0, periods).forEach((item, i) => {
    const typeLabels = {theory:'<span class="period-pill theory">Theory</span>', activity:'<span class="period-pill activity">Activity</span>', project:'<span class="period-pill project">Project</span>'};
    const priColors = {High:'color:#DC2626;font-weight:700', Medium:'color:#D97706;font-weight:600', Low:'color:#6B7280'};
    const statusColor = i === 0 ? 'color:#16A34A;font-weight:600' : 'color:#94A3B8';
    const status = i === 0 ? '🟢 Up Next' : i < 3 ? '⏳ Queued' : '📋 Planned';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:'Syne',sans-serif;font-weight:700">${periodNum}</td>
      <td>${item.t || item.title || ''}</td>
      <td>${typeLabels[item.type] || ''}</td>
      <td>35 min</td>
      <td style="${priColors[item.pri] || ''}">${item.pri}</td>
      <td style="${statusColor}">${status}</td>`;
    tbody.appendChild(tr);
    periodNum++;
  });
}

function buildTypeTable(sylPct, periods) {
  const remaining = 100 - sylPct;
  const theory = Math.round(periods * 0.45);
  const activity = Math.round(periods * 0.35);
  const project = periods - theory - activity;
  const hrs = p => ((p * 35) / 60).toFixed(1) + ' hrs';
  const tbody = document.getElementById('tt-type-body');
  if (!tbody) return;
  tbody.innerHTML = `
    <tr><td>Theory / Core Topics</td><td>${theory}</td><td>${hrs(theory)}</td><td><span class="period-pill theory">Regular</span></td></tr>
    <tr><td>Activity Classes</td><td>${activity}</td><td>${hrs(activity)}</td><td><span class="period-pill activity">Activity</span></td></tr>
    <tr><td>Project / Assessment</td><td>${project}</td><td>${hrs(project)}</td><td><span class="period-pill project">Project</span></td></tr>
    <tr style="font-weight:700"><td>Total Remaining</td><td>${periods}</td><td>${hrs(periods)}</td><td>—</td></tr>`;
}

function buildWeekly(periods) {
  const container = document.getElementById('tt-weekly-breakdown');
  if (!container) return;
  const weeks = Math.ceil(periods / 3);
  const perWeek = Math.ceil(periods / Math.max(weeks, 1));
  let html = '';
  let remaining = periods;
  for (let w = 1; w <= Math.min(weeks, 6); w++) {
    const p = Math.min(perWeek, remaining);
    remaining -= p;
    const pct = Math.round((p / Math.max(periods, 1)) * 100);
    const wLabel = `Week ${w}`;
    html += `<div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:500">${wLabel}</span>
        <span style="font-size:12px;color:var(--ink-mid)">${p} periods · ${p * 35} min</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--terracotta),var(--gold))"></div></div>
    </div>`;
    if (remaining <= 0) break;
  }
  container.innerHTML = html;
}

function buildTips(sylPct, periods, remaining) {
  const container = document.getElementById('tt-tips-body');
  if (!container) return;
  const tips = [];

  if (periods <= 20 && remaining > 40) {
    tips.push({icon:'🚀', title:'Speed-Teaching Strategy', msg:'Cover 2 short topics per period. Use "key concept + one example + one practice" format to save time.', color:'rgba(200,75,47,0.08)'});
    tips.push({icon:'📋', title:'Prioritize Exam Topics', msg:'Focus on topics with highest marks weightage first. Skip demonstrations — use diagrams instead.', color:'rgba(212,168,75,0.08)'});
    tips.push({icon:'👥', title:'Use Peer Learning', msg:'Group stronger students with weaker ones. Save 10 min per period by using student-led explanations.', color:'rgba(91,141,184,0.08)'});
    tips.push({icon:'📝', title:'Combined Assessment', msg:'Use one 45-min session for both revision + assessment instead of separate sessions.', color:'rgba(122,158,126,0.08)'});
  } else if (remaining <= 20) {
    tips.push({icon:'🎉', title:'Almost Done!', msg:'Only a few topics left. Use remaining periods for revision, project completion, and student presentations.', color:'rgba(122,158,126,0.08)'});
    tips.push({icon:'🔄', title:'Revision Sessions', msg:'Add 2-3 full revision sessions to consolidate all learning before term end.', color:'rgba(212,168,75,0.08)'});
  } else {
    tips.push({icon:'⚖️', title:'Balanced Pace', msg:'Mix theory (2 periods) + activity (2 periods) + project (1 period) each week for balanced learning.', color:'rgba(91,141,184,0.08)'});
    tips.push({icon:'🌟', title:'Extension Activities', msg:'With comfortable pace, use extra periods for field visits, guest lectures, or student projects.', color:'rgba(122,158,126,0.08)'});
  }

  container.innerHTML = tips.map(t => `
    <div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:${t.color};border-radius:12px;border:1px solid ${t.color.replace('0.08','0.2')}">
      <span style="font-size:24px;flex-shrink:0">${t.icon}</span>
      <div><strong style="color:var(--ink);font-size:13.5px">${t.title}</strong><div style="font-size:13px;color:var(--ink-mid);margin-top:3px;line-height:1.5">${t.msg}</div></div>
    </div>`).join('');
}

/* ══════════════════════════════════════
   FIELD VISITS TABS
══════════════════════════════════════ */
function switchFVTab(tab, el) {
  document.querySelectorAll('.fv-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.fv-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('fv-' + tab).classList.add('active');
}

function selectGuestMode(el, mode) {
  document.querySelectorAll('.fv-mode-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function findGuestExperts() {
  const results = document.getElementById('fv-expert-results');
  if (results) {
    results.style.display = 'block';
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Init on load
window.onload = function() {
  updateTimetable();
  // Home is the default page — hide sidebar and topbar
  const sidebar = document.getElementById('sidebar');
  const mainEl = document.querySelector('.main');
  const topbar = document.querySelector('.topbar');
  if (sidebar) sidebar.style.display = 'none';
  if (mainEl) mainEl.style.marginLeft = '0';
  if (topbar) topbar.style.display = 'none';
};

/* ── MOBILE SIDEBAR TOGGLE ── */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle = document.getElementById('menuToggle');
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    toggle.classList.add('open');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle = document.getElementById('menuToggle');
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  toggle.classList.remove('open');
}

// Close sidebar on nav item click (mobile)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      if (window.innerWidth <= 767) closeSidebar();
    });
  });
});
