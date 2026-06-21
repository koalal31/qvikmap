const fs = require('fs');
const os = require('os');
const path = require('path');
const MarkdownIt = require('markdown-it');
const PdfPrinter = require('pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

// vfs export holds the Roboto ttf files as base64; write them to disk for PdfPrinter
const vfs = (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) || pdfFonts.vfs || pdfFonts;
const fontDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdffonts-'));
for (const name of ['Roboto-Regular.ttf', 'Roboto-Medium.ttf', 'Roboto-Italic.ttf', 'Roboto-MediumItalic.ttf']) {
  fs.writeFileSync(path.join(fontDir, name), Buffer.from(vfs[name], 'base64'));
}
const printer = new PdfPrinter({
  Roboto: {
    normal: path.join(fontDir, 'Roboto-Regular.ttf'),
    bold: path.join(fontDir, 'Roboto-Medium.ttf'),
    italics: path.join(fontDir, 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontDir, 'Roboto-MediumItalic.ttf'),
  },
});

const CONTENT_WIDTH = 495; // A4 595.28pt - 50 - 50 margins

const md = new MarkdownIt();
const src = fs.readFileSync(process.argv[2], 'utf8');
const tokens = md.parse(src, {});

function inlineToRuns(token) {
  const runs = [];
  let bold = false, italics = false, link = null;
  const style = () => {
    const o = {};
    if (bold) o.bold = true;
    if (italics) o.italics = true;
    if (link) { o.link = link; o.color = '#1a5fb4'; o.decoration = 'underline'; }
    return o;
  };
  for (const c of token.children || []) {
    if (c.type === 'text') { if (c.content) runs.push(Object.assign({ text: c.content }, style())); }
    else if (c.type === 'strong_open') bold = true;
    else if (c.type === 'strong_close') bold = false;
    else if (c.type === 'em_open') italics = true;
    else if (c.type === 'em_close') italics = false;
    else if (c.type === 'code_inline') runs.push({ text: c.content, background: '#f2f2f2', color: '#b02a1d' });
    else if (c.type === 'link_open') link = c.attrGet('href');
    else if (c.type === 'link_close') link = null;
    else if (c.type === 'softbreak') runs.push({ text: ' ' });
    else if (c.type === 'hardbreak') runs.push({ text: '\n' });
  }
  return runs.length ? runs : [{ text: '' }];
}

const content = [];
let i = 0;
while (i < tokens.length) {
  const t = tokens[i];
  if (t.type === 'heading_open') {
    content.push({ text: inlineToRuns(tokens[i + 1]), style: t.tag });
    if (t.tag === 'h2') {
      content.push({ canvas: [{ type: 'line', x1: 0, y1: 2, x2: CONTENT_WIDTH, y2: 2, lineWidth: 0.7, lineColor: '#dddddd' }], margin: [0, 0, 0, 6] });
    }
    i += 3; continue;
  }
  if (t.type === 'paragraph_open') {
    content.push({ text: inlineToRuns(tokens[i + 1]), style: 'para' });
    i += 3; continue;
  }
  if (t.type === 'hr') {
    content.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 8, 0, 12] });
    i += 1; continue;
  }
  if (t.type === 'bullet_list_open') {
    const items = [];
    i++;
    while (tokens[i] && tokens[i].type !== 'bullet_list_close') {
      if (tokens[i].type === 'list_item_open') {
        let j = i + 1;
        const itemRuns = [];
        while (tokens[j] && tokens[j].type !== 'list_item_close') {
          if (tokens[j].type === 'inline') {
            if (itemRuns.length) itemRuns.push({ text: '\n' });
            itemRuns.push(...inlineToRuns(tokens[j]));
          }
          j++;
        }
        items.push({ text: itemRuns, margin: [0, 1, 0, 1] });
        i = j + 1;
      } else i++;
    }
    content.push({ ul: items, style: 'para', margin: [0, 2, 0, 8] });
    i++; continue;
  }
  if (t.type === 'blockquote_open') {
    let j = i + 1;
    const runs = [];
    while (tokens[j] && tokens[j].type !== 'blockquote_close') {
      if (tokens[j].type === 'inline') {
        if (runs.length) runs.push({ text: '\n' });
        runs.push(...inlineToRuns(tokens[j]));
      }
      j++;
    }
    content.push({
      table: { widths: ['*'], body: [[{ text: runs, italics: true, color: '#555555' }]] },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: (idx) => (idx === 0 ? 3 : 0),
        vLineColor: () => '#cccccc',
        paddingLeft: () => 10, paddingRight: () => 10, paddingTop: () => 6, paddingBottom: () => 6,
        fillColor: () => '#fafafa',
      },
      margin: [0, 4, 0, 12],
    });
    i = j + 1; continue;
  }
  i++;
}

const docDefinition = {
  content,
  pageSize: 'A4',
  pageMargins: [50, 50, 50, 55],
  defaultStyle: { font: 'Roboto', fontSize: 10.5, lineHeight: 1.3, color: '#222222' },
  styles: {
    h1: { fontSize: 22, bold: true, margin: [0, 0, 0, 12], color: '#111111' },
    h2: { fontSize: 15, bold: true, margin: [0, 16, 0, 2], color: '#1a3a5c' },
    h3: { fontSize: 12, bold: true, margin: [0, 12, 0, 3], color: '#333333' },
    para: { fontSize: 10.5, margin: [0, 0, 0, 8] },
  },
  footer: (cur, total) => ({ text: `${cur} / ${total}`, alignment: 'center', fontSize: 8, color: '#999999', margin: [0, 8, 0, 0] }),
};

const out = process.argv[3];
const doc = printer.createPdfKitDocument(docDefinition);
const stream = fs.createWriteStream(out);
doc.pipe(stream);
doc.end();
stream.on('finish', () => console.log('WROTE ' + out + ' (' + fs.statSync(out).size + ' bytes)'));
stream.on('error', (e) => { console.error('ERR', e); process.exit(1); });
