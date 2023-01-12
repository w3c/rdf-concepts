require(["core/pubsubhub"], (respecEvents) => {
  respecEvents.sub('end-all', (documentElement) => {
    // remove data-cite on where the citation is to ourselves.
    const selfCites = Array.from(document.querySelectorAll(`a[data-cite^='${respecConfig.shortName}' i]`));
    for (const anchor of selfCites) {
      const text = anchor.text + ' (this document)';
      const citeParent = anchor.parentNode.parentNode;
      citeParent.removeChild(anchor.parentNode);
      citeParent.textContent = text;
    }

    // Add highlighting and remove comment from pre elements
    for (const pre of document.querySelectorAll("pre")) {
      // First pre element of aside
      const content = pre.innerHTML
        .replace(/\*\*\*\*([^*]*)\*\*\*\*/g, '<span class="hl-bold">$1</span>')
        .replace(/####([^#]*)####/g, '<span class="comment">$1</span>');
      pre.innerHTML = content;
    }
  });
});

function _esc(s) {
  return s.replace(/&/g,'&amp;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/</g,'&lt;');
}

function updateExample(doc, content) {
  // perform transformations to make it render and prettier
  return _esc(unComment(doc, content));
}

function unComment(doc, content) {
  // perform transformations to make it render and prettier
  return content
    .replace(/<!--/, '')
    .replace(/-->/, '')
    .replace(/< !\s*-\s*-/g, '<!--')
    .replace(/-\s*- >/g, '-->')
    .replace(/-\s*-\s*&gt;/g, '--&gt;');
}
