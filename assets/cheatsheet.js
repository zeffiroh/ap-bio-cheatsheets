(function () {
  const ACADEMIC_BADGES = {
    'example': '[EXAMPLE & BIOLOGICAL APPLICATION]',
    'remember': '[CORE AXIOM / REMEMBER]',
    'note': '[MECHANISTIC NOTE]',
    'exam-tip': '[AP EXAM FRQ SCORING STRATEGY]',
    'mistake': '[COMMON AP EXAM FRQ TRAP]'
  };

  function initAcademicCallouts() {
    document.querySelectorAll('.callout').forEach(el => {
      if (el.querySelector('.callout-label')) return;
      let type = 'remember';
      for (const k of Object.keys(ACADEMIC_BADGES)) {
        if (el.classList.contains(k)) {
          type = k;
          break;
        }
      }
      const badgeText = el.getAttribute('data-label') || ACADEMIC_BADGES[type];
      const innerHTML = el.innerHTML;
      el.innerHTML = `<span class="callout-label">${badgeText}</span><div class="callout-content">${innerHTML}</div>`;
    });
  }

  function initSectionNumberingAndMindmaps() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, idx) => {
      const header = card.querySelector('.card-header');
      let sectionTitle = 'Concept';
      if (header) {
        const firstSpan = header.querySelector('span');
        if (firstSpan) {
          sectionTitle = firstSpan.textContent.trim();
          if (!sectionTitle.startsWith('§')) {
            firstSpan.textContent = `§${idx + 1}. ${sectionTitle}`;
          }
        }
      }

      // Highlight inline definitions (bold terms followed by colon or em-dash)
      const body = card.querySelector('.card-body');
      if (!body) return;

      body.querySelectorAll('li > strong:first-child, li > b:first-child').forEach(st => {
        st.classList.add('def-term');
      });

      // Add a Hierarchical Concept Map / Flowchart inside every major section if not already present
      if (card.classList.contains('no-mindmap') || body.querySelector('.section-mindmap')) return;

      const keyNodes = [];
      body.querySelectorAll(':scope > ul > li').forEach(li => {
        const strong = li.querySelector('strong, b');
        if (strong) {
          let txt = strong.textContent.replace(/[:—–\-]+$/, '').trim();
          if (txt.length > 2 && txt.length <= 42 && !keyNodes.includes(txt)) {
            keyNodes.push(txt);
          }
        }
      });

      if (keyNodes.length >= 2) {
        const cleanRoot = sectionTitle.replace(/^§\d+\.\s*/, '').split(':')[0].trim();
        const mm = document.createElement('div');
        mm.className = 'section-mindmap';
        const nodesHTML = keyNodes.slice(0, 5).map((n, i) => {
          const arrow = `<span class="mm-arrow">➔</span>`;
          const cls = i === 0 ? 'mm-node mm-sub' : 'mm-node';
          return `${arrow}<span class="${cls}">${n}</span>`;
        }).join('');

        mm.innerHTML = `
          <div class="mindmap-title">
            <span>HIERARCHICAL CONCEPT &amp; PATHWAY MAP</span>
            <span>[CAUSE ➔ MECHANISM ➔ OUTCOME]</span>
          </div>
          <div class="mindmap-flow">
            <span class="mm-node mm-root">${cleanRoot}</span>
            ${nodesHTML}
          </div>
        `;
        body.insertBefore(mm, body.firstChild);
      }
    });
  }

  function harmonizeSvgPalette() {
    // Recolor non-academic pastel blues/cyans/greens/purples in SVGs to Crimson/Black/Charcoal/Warm-Tint academic palette
    document.querySelectorAll('.diagram-box svg').forEach(svg => {
      svg.querySelectorAll('*').forEach(el => {
        ['fill', 'stroke'].forEach(attr => {
          const val = el.getAttribute(attr);
          if (!val) return;
          const v = val.toLowerCase().trim();
          if (v === 'none' || v === '#ffffff' || v === '#fff' || v === 'white') return;
          if (attr === 'fill') {
            // Light pastel fills -> soft crimson/ivory academic tints
            if (['#e0f2fe', '#dbeafe', '#eff6ff', '#f0f9ff', '#f1f5f9', '#f8fafc', '#dcfce7', '#f0fdf4', '#f3e8ff', '#faf5ff', '#fef3c7', '#fffbeb', '#e2e8f0', '#fef2f2', '#fee2e2', '#fce7f3', '#ecfdf5', '#ede9fe'].includes(v)) {
              el.setAttribute('fill', '#fdf2f2');
            } else if (['#bae6fd', '#bfdbfe', '#93c5fd', '#bbf7d0', '#a7f3d0', '#ddd6fe', '#e9d5ff', '#fde68a', '#fecaca', '#fbcfe8', '#c7d2fe', '#99f6e4'].includes(v)) {
              el.setAttribute('fill', '#f5dada');
            } else if (['#0f172a', '#1e293b', '#334155', '#0d2847', '#111827', '#1e3a8a', '#064e3b', '#065f46'].includes(v)) {
              el.setAttribute('fill', '#000000');
            } else if (['#475569', '#64748b'].includes(v)) {
              el.setAttribute('fill', '#222222');
            } else if (el.tagName.toLowerCase() === 'text' || el.tagName.toLowerCase() === 'tspan') {
              el.setAttribute('fill', '#8b0000');
            } else {
              el.setAttribute('fill', '#8b0000');
            }
          } else if (attr === 'stroke') {
            if (['#cbd5e1', '#e2e8f0', '#94a3b8'].includes(v)) {
              el.setAttribute('stroke', '#888888');
            } else if (['#0f172a', '#1e293b', '#334155', '#000000', '#000'].includes(v)) {
              el.setAttribute('stroke', '#000000');
            } else {
              el.setAttribute('stroke', '#8b0000');
            }
          }
        });
      });
    });
  }

  function initAll() {
    initAcademicCallouts();
    initSectionNumberingAndMindmaps();
    harmonizeSvgPalette();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
