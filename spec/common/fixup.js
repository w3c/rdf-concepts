require(["core/pubsubhub"], (respecEvents) => {
  respecEvents.sub('end-all', (documentElement) => {
    // remove data-cite where the citation is to ourselves.
    const selfCites = Array.from(document.querySelectorAll(`a[data-cite^='${respecConfig.shortName}' i]`));
    for (const anchor of selfCites) {
      const text = anchor.text + ' (this document)';
      const citeParent = anchor.parentNode.parentNode;
      const textSpan = document.createElement('span');
      textSpan.textContent = text;
      citeParent.replaceChild(textSpan, anchor.parentNode);
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

function updateExample(utils, content) {
  // perform transformations to make it render and prettier
  return _esc(unComment(utils, content));
}

function unComment(utils, content) {
  // perform transformations to make it render and prettier
  return content
    .replace(/<!--/, '')
    .replace(/-->/, '')
    .replace(/< !\s*-\s*-/g, '<!--')
    .replace(/-\s*- >/g, '-->')
    .replace(/-\s*-\s*&gt;/g, '--&gt;');
}

// If content is a self-citation, replace it with the document name
function noSelfCite(utils, content) {
  if (content.toUpperCase() === `[[[${respecConfig.shortName}]]]`.toUpperCase()) {
    return respecConfig.title + ' (this document)';
  } else {
    return content;
  }
}