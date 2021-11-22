import type {SemanticTree} from "yoxel";

export const focusInInput = (event: any): boolean => (
  event.target
    ? /input|textarea/i.test(event.target.tagName) ||
    event.target.getAttribute('contenteditable') !== null
    : false
)

export const getStoryFrame = (): Document | undefined => {
  const previewIframe: HTMLIFrameElement | null = document.querySelector(
    '#storybook-preview-iframe',
  );
  return previewIframe?.contentWindow?.document || undefined;
}

export const getStoryTarget = (): HTMLElement | undefined => {
  return getStoryFrame()?.body?.querySelector('#root') || undefined;
}

export const getHeaderPrefix = (tree: SemanticTree): string => {
  const pad = (n: number) => `${'-'.repeat(n)} `;

  switch (tree.type) {
    case 'h1':
      return pad(0);
    case 'h2':
      return pad(1);
    case 'h3':
      return pad(2);
    case 'h4':
      return pad(3);
    case 'h5':
      return pad(4);
    case 'h6':
      return pad(5);
  }
  return '';
}

export const isEnabled = <T extends string | boolean>(value: T, match: string): boolean => {
  return value === true || value === match;
}