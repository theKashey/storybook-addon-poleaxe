export const focusInInput = (event: any): boolean => (
  event.target
    ? /input|textarea/i.test(event.target.tagName) ||
    event.target.getAttribute('contenteditable') !== null
    : false
)

export const getStoryFrame = (): Document | undefined  => {
  const previewIframe: HTMLIFrameElement | null = document.querySelector(
    '#storybook-preview-iframe',
  );
  return previewIframe?.contentWindow?.document || undefined;
}

export const getStoryTarget = (): HTMLElement | undefined  => {
  return getStoryFrame()?.body.querySelector('#root') || undefined;
}