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

    case 'Workspace':
      response = 'box';
      break;

    case 'Workspace':
      response = 'box';
      break;

    case 'Workspace':
      response = 'box';
      break;

    case 'Workspace':
      response = 'box';
      break;

    default:
      response = 'list';
  }

  return response;
}
