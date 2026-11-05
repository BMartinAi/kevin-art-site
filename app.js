const STEPS = [
  { key: "greeting", label: "Say hello" },
  { key: "orient", label: "What we're working on" },
  { key: "collateral", label: "Your marketing basics" },
  { key: "faq", label: "Teach your site the answers" },
  { key: "guardrails", label: "Set your guardrails" },
  { key: "done", label: "Review & export" },
];

const state = JSON.parse(localStorage.getItem("kevinArtState") || "null") || {
  stage: "greeting",
  name: "",
  qIndex: 0,
  answers: {},
  guardrails: [...DEFAULT_GUARDRAILS],
};

function save() {
  localStorage.setItem("kevinArtState", JSON.stringify(state));
}

function goTo(stage) {
  state.stage = stage;
  save();
  render();
}

function renderSteps() {
  const ol = document.getElementById("steps");
  const currentIndex = STEPS.findIndex((s) => s.key === state.stage);
  ol.innerHTML = STEPS.map((s, i) => {
    const cls = i < currentIndex ? "done" : i === currentIndex ? "active" : "";
    return `<li class="${cls}"><span class="dot"></span>${s.label}</li>`;
  }).join("");
}

function el(html) {
  const div = document.createElement("div");
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

function render() {
  renderSteps();
  const screen = document.getElementById("screen");
  screen.innerHTML = "";

  if (state.stage === "greeting") {
    screen.appendChild(el(`
      <div>
        <h1>Hello! What's your name?</h1>
        <p class="sub">I'll remember it for every session after this one.</p>
        <div class="row">
          <input type="text" id="nameInput" placeholder="Your name" value="${state.name}" />
          <button class="btn-primary" id="goOrient">Continue</button>
        </div>
      </div>
    `));
    const input = document.getElementById("nameInput");
    input.focus();
    const submit = () => {
      const v = input.value.trim();
      if (!v) return;
      state.name = v;
      goTo("orient");
    };
    document.getElementById("goOrient").onclick = submit;
    input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
  }

  if (state.stage === "orient") {
    screen.appendChild(el(`
      <div>
        <h1>Hi ${state.name}. What are we working on today?</h1>
        <p class="sub">Let's start with your marketing basics — photos, a logo, and the questions people usually ask you.</p>
        <button class="btn-primary" id="goCollateral">Get new clients →</button>
      </div>
    `));
    document.getElementById("goCollateral").onclick = () => goTo("collateral");
  }

  if (state.stage === "collateral") {
    screen.appendChild(el(`
      <div>
        <h1>Let's start with your marketing.</h1>
        <p class="sub">Photo upload and the logo/demo-clip generator plug in once your image-generation connection is authorized. For now, let's teach your site how to answer questions — that part's ready.</p>
        <button class="btn-primary" id="goFaq">Continue →</button>
      </div>
    `));
    document.getElementById("goFaq").onclick = () => goTo("faq");
  }

  if (state.stage === "faq") {
    const q = ALL_QUESTIONS[state.qIndex];
    const answeredCount = Object.keys(state.answers).length;
    const pct = Math.round((state.qIndex / ALL_QUESTIONS.length) * 100);
    screen.appendChild(el(`
      <div>
        <h1>Now let's teach your website how to answer questions.</h1>
        <p class="meta">${q.category} · Question ${state.qIndex + 1} of ${ALL_QUESTIONS.length} · ${answeredCount} answered so far</p>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="card">
          <p class="q">${q.question}</p>
          <textarea id="answerInput" rows="3" placeholder="Type your real answer…">${state.answers[q.question] || ""}</textarea>
        </div>
        <div class="row">
          <button class="btn-primary" id="saveNext">Save &amp; next</button>
          <button class="btn-text" id="finishLater">Finish for now, continue later</button>
        </div>
      </div>
    `));
    document.getElementById("saveNext").onclick = () => {
      const v = document.getElementById("answerInput").value.trim();
      if (v) state.answers[q.question] = v;
      if (state.qIndex + 1 < ALL_QUESTIONS.length) {
        state.qIndex += 1;
        save();
        render();
      } else {
        goTo("guardrails");
      }
    };
    document.getElementById("finishLater").onclick = () => goTo("guardrails");
  }

  if (state.stage === "guardrails") {
    screen.appendChild(el(`
      <div>
        <h1>Anything your site should never try to answer on its own?</h1>
        <p class="sub">Any time one of these comes up, your assistant skips straight to getting them on your calendar instead of guessing.</p>
        <div id="guardrailList"></div>
        <div class="row" style="margin-bottom:24px">
          <input type="text" id="newGuardrail" placeholder="Add another topic…" />
          <button class="btn-outline" id="addGuardrail">Add</button>
        </div>
        <button class="btn-primary" id="goDone">Save guardrails →</button>
      </div>
    `));
    const renderList = () => {
      const list = document.getElementById("guardrailList");
      list.innerHTML = state.guardrails.map((g, i) => `
        <div class="chip-row">${g}<button class="chip-remove" data-i="${i}">Remove</button></div>
      `).join("");
      list.querySelectorAll(".chip-remove").forEach((btn) => {
        btn.onclick = () => {
          state.guardrails.splice(Number(btn.dataset.i), 1);
          save();
          renderList();
        };
      });
    };
    renderList();
    document.getElementById("addGuardrail").onclick = () => {
      const input = document.getElementById("newGuardrail");
      if (input.value.trim()) {
        state.guardrails.push(input.value.trim());
        input.value = "";
        save();
        renderList();
      }
    };
    document.getElementById("goDone").onclick = () => goTo("done");
  }

  if (state.stage === "done") {
    screen.appendChild(el(`
      <div>
        <h1>You're set up for now, ${state.name}.</h1>
        <p class="sub">Your answers are saved on this device. Download them below and send to ViCi to merge into your shared vault — the direct live-sync is coming once that connection is finished.</p>
        <button class="btn-primary" id="exportBtn">Download my answers (.md)</button>
        <p class="notice">This download is in the exact format your vault uses, so it can be pasted straight in — nothing gets retyped.</p>
      </div>
    `));
    document.getElementById("exportBtn").onclick = exportMarkdown;
  }
}

function exportMarkdown() {
  let md = `---\nstatus: active\ntype: faq-answers\n---\n# Kevin's FAQ Answers\n\n`;
  for (const [q, a] of Object.entries(state.answers)) {
    md += `### ${q}\n${a}\n\n`;
  }
  md += `\n## Guardrails\n\n`;
  for (const g of state.guardrails) md += `- ${g}\n`;

  const blob = new Blob([md], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Kevin-FAQ-Answers.md";
  a.click();
}

render();
