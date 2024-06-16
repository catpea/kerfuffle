export default function(className){
  let response;

  switch (className) {

    case 'Workspace':
      response = 'box';
      break;

    case 'Window':
      response = 'window-fullscreen';
      break;

    case 'Terminal':
      response = 'terminal';
      break;

    case 'Editor':
      response = 'window-sidebar';
      break;

    case 'Architecture':
      response = 'gem';
      break;

    case 'Analysis':
      response = 'diagram-3';
      break;

    case 'Pipe':
      response = 'share-fill';
      break;

    case 'Pane':
      response = 'calendar3-week';
      break;

    case 'Caption':
      response = 'usb';
      break;

    case 'Foreign':
      response = 'wrench-adjustable';
      break;

    case 'Sockets':
      response = 'node-plus';
      break;

    case 'Vertical':
      response = 'arrows-vertical';
      break;

    case 'Hortizontal':
      response = 'arrows';
      break;

    case 'Container':
      response = 'box2-heart';
      break;

    case 'Component':
      response = 'heart-pulse';
      break;

    case 'Application':
      response = 'brightness-high';
      break;

    default:
      response = 'list';
  }

  return response;
}
