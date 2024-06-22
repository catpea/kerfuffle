import { writable } from 'svelte/store';

export function getApplicationTree(component) {
	const { subscribe, update } = writable( {children:[]} );

	function addDirectory({id, name, type, parent}, depth=0){
		const directory = {id, name, type, children:[], object:parent, open:depth>3?false:true};
		depth++;

		if(parent?.children){
			for (const child of parent.children) {
				directory.children.push( addDirectory({id:child.id, name: child.name||child.oo.name, type:child.oo.name, parent:child}, depth) );
	 		}
		}

		if((type!=='Workspace') && parent?.applications){
			for (const element of parent.applications) {
				directory.children.push( addDirectory({id:element.id, name: element.name||element.oo.name, type:element.oo.name, parent:element}, depth) );
	 		}
		}
 		return directory;
  }

	const system = component.getRoot();

	function snapshot(){
		update(()=>addDirectory({id:system.id, name:system.name, parent:system, type:system.oo.name}));
	}

	snapshot();
	setTimeout(()=>snapshot(),100);
	setTimeout(()=>snapshot(),1000);
	setTimeout(()=>snapshot(),5000);

	return {
		subscribe,
		snapshot,
	};
}


export default {
  getApplicationTree,

}
