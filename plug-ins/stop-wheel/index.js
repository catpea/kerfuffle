export default function stopWheel(el){
  el.addEventListener('wheel', (e)=>{
    if (e.shiftKey) {
      e.preventDefault();
      return false;
    };
    e.stopPropagation()
  });
}
