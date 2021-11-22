export const getBox = (node: Element, depth = 0): {
  left: number;
  top: number;
  width: number;
  height: number;
} => {
  const box = node.getBoundingClientRect();
  if (box.width > 1) {
    return box;
  }
  if (depth > 10) {
    return box;
  }
  if (node.previousElementSibling) {
    return getBox(node.previousElementSibling, depth + 1);
  }
  if (node.parentElement) {
    return getBox(node.parentElement, depth + 1);
  }
  return box;
}