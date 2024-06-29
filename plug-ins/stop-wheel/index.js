export default function stopWheel(el){



  el.addEventListener('wheel', (e)=>{

    const hasVerticalScrollbar = el.clientHeight < el.scrollHeight;
    const hasHorizontalScrollbar = el.clientWidth < el.scrollWidth;
    const isHoldingShiftKey = e.shiftKey;

    let action = 'zoom';

    if(hasVerticalScrollbar) action = 'scroll';
    if(isHoldingShiftKey) action = 'zoom';

    if( action == 'zoom' ) {
      e.preventDefault(); // do not perform default action
      return false;
    };

    if( action == 'scroll' ) {
      e.stopPropagation(); // end the event at the scroll, don't let anubody else hear it.
    }

  });


}
