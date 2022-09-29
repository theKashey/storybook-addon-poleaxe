import { buildTree, listHeadings } from 'yoxel';

import { getHeaderPrefix } from '../components/utils';
import { getBox } from './box';

type RemoveCB = () => void;

/**
 * Creates overlays on top of all headings in the given node
 * @param node
 * @returns cancel callback
 */
export const highlightHeadings = (
  node: HTMLElement,
  hovers: HTMLDivElement[] = [],
  hoverMap = new WeakMap<HTMLElement, HTMLDivElement>()
): RemoveCB => {
  const headers = listHeadings(buildTree(node));
  const usedHovers = new Set(hovers);
  const doc = node.ownerDocument;
  const defaultView = node.ownerDocument.defaultView;
  const scrollLeft = defaultView!.scrollX;
  const scrollTop = defaultView!.scrollY;

  const createHL = (): HTMLDivElement => {
    const hl = doc.createElement('div');
    hl.id = 'poleaxe-highlight';
    doc.body.appendChild(hl);
    hovers.push(hl);
    return hl;
  };

  headers.forEach((h) => {
    const node = h.node;
    const hl = hoverMap.get(node) || createHL();
    hoverMap.set(node, hl);
    usedHovers.delete(hl);

    const box = getBox(node);
    hl.innerHTML = `<span 
style="background-color: rgba(185, 74, 72,0.8);color:#FFF;font-size: 10px;padding: 2px;text-shadow: 0 0 1px #000;top:0;transform: translateY(-100%);position:absolute">
${getHeaderPrefix(h)}${node.tagName}
</span>`;

    Object.assign(hl.style, {
      left: box.left + scrollLeft + 'px',
      top: box.top + scrollTop + 'px',
      width: box.width - 2 + 'px',
      height: box.height + 'px',
      position: 'absolute',
      border: '1px solid rgba(255,200,200,0.2)',
      borderTop: '1px solid rgba(255,200,200,0.8)',
      // backgroundColor: 'rgba(200,200,255,0.05)',
      pointerEvents: 'none',
      display: 'block',
    });
  });
  usedHovers.forEach((h) => h.parentNode?.removeChild(h));

  return () => {
    hovers.forEach((h) => h.parentNode?.removeChild(h));
  };
};
