export const mod = {
  copyToClipboard: async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const element = document.createElement('textarea');
      element.value = text;
      document.body.appendChild(element);
      element.select();
      document.execCommand('copy');
      document.body.removeChild(element);
    }
  }
}
