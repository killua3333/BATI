export function useShare(){
  async function shareText(text:string){
    if (navigator.share){ await navigator.share({ text }); return true; }
    await navigator.clipboard.writeText(text);
    return false;
  }
  return { shareText };
}
