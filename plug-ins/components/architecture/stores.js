import { writable } from 'svelte/store';

export function createCounter() {
	const { subscribe, update } = writable(0);

	function increment() {
		update((count) => count + 1);
	}

	return {
		subscribe,
		increment
	};
}

export function getPaneItems1(root) {
	const { subscribe, update } = writable( [] );

  // root.on('children', v=>update(x => v), {initialize:true});
  root.on('children.changed', v=>update(x => v), {initialize:true});

	return {
		subscribe,
		// increment
	};

}



export function getPaneItems(root) {
	const { subscribe, update } = writable( [] );

  // root.on('children', v=>update(x => v), {initialize:true});
  // root.on('children.changed', v=>update(x => v.map(o=>({id:o.id, name:o.name, type:o.oo.name}) )), {initialize:true});

  // root.on('origins.changed', v=>update(x => v.map(o=>({id:o.id, name:o.name, type:o.oo.name}) )), {initialize:true});

  function refresh(){
    const list = [];

      list.push({ label: 'Applications', list: root.applications.raw.map(o=>({id:o.id, name:o.name, type:o.oo.name})) })
      list.push({ label: 'Origins', list: root.origins.raw.map(o=>({id:o.id, name:o.name})) })

    update(()=>list);
  }

  root.on('origins.changed', ()=>refresh());
  root.on('applications.changed', ()=>refresh());

  refresh();

	return {
		subscribe,
		// increment
	};

}

export function getApplicationTree(component) {
	const monitor = [];
	const unmonitor = [];
	const { subscribe, update } = writable( {children:[]} );

	function addDirectory({id, name, type, parent}, depth=0){
		const directory = {id, name, type, children:[], object:parent, open:depth>2?false:true};
		depth++;
		if(parent?.children){
			for (const child of parent.children) {
				directory.children.push( addDirectory({id:child.id, name: child.name||child.oo.name, type:child.oo.name, parent:child}, depth) );
				monitor.push([parent, 'children.changed'])
	 		}
		}
		if((type=='Workspace') && parent?.applications){
			// monitor.push([parent, 'applications.changed'])
		}
		if((type!=='Workspace') && parent?.applications){
			for (const element of parent.applications) {
				directory.children.push( addDirectory({id:element.id, name: element.name||element.oo.name, type:element.oo.name, parent:element}, depth) );
				monitor.push([parent, 'applications.changed'])
	 		}
		}
 		return directory;
  }

	const system = component.getRoot();

	function refresh(){
		console.log('REFRESH!', unmonitor.length);
		unmonitor.map(o=>o());
		monitor.splice(0, monitor.length);
		update(()=>addDirectory({id:system.id, name:system.name, parent:system, type:system.oo.name}));
		// monitor.push([system, 'applications.changed'])
		monitor.map(  ([o,event]) => unmonitor.push(o.on(event, ()=>setTimeout(()=>refresh(),1 /* BUG: still inacurate, but a nice try, must run after component creation copmpletes via mout & co.*/), {autorun:false, manual:true}))  )
	}

	system.on('applications.changed', ()=>refresh() );

	// console.log();
	refresh();
	// setTimeout(()=>refresh(),1000);

	function cleanup(){
		console.log('STORE CLEANUP!');
		unmonitor.map(o=>o());
		monitor.splice(0, monitor.length);
	}

	return {
		subscribe: (...argv)=>{
			cleanup();
			return subscribe(...argv);
		},
		refresh,
		// increment
	};
}

export function getChildTree(system) {
	const { subscribe, update } = writable( {} );

	const root = { id: 'root', name: 'root', type: 'root', kind: 'root', children:[], };

  function mount({id, name, type, list, kind}){
		const tree = addDirectory({id, name, type, list, kind});
		root.children.push(tree);
    update(()=>root);
  }

	function addDirectory({id, name, type, list, kind}){
		const directory = {id, name, type, children:[]};
		console.log(`FF ADDING ${type}`, {id, name, type, list:list});
		if(list){
			console.log(`FF ADDING LIST`, list.raw);
			for (const item of list) {

				const data = [];
				if(item[kind]) data.push(...item[kind]);
				if(kind=='children' && item.oo.name=='Pane' && item.elements){
					data.push(...item.elements )
				}

				directory.children.push( addDirectory({id:item.id, name: item.name, type:item.oo.name, list:data, kind}) );
	 		}
		} // if list

 		return directory;
  }

	mount({id:system.id, name:'Children', list:system.children, type:'children', kind:'children'});
	// mount({id:system.id, name:'Elements', list:system.elements, type:'elements', kind:'elements'});

   // system.on('children', ()=>mount({id:system.id, name:'children', list:system.children, type:'children', kind:'children'}));
	 // system.on('elements', ()=>mount({id:system.id, name:'elements', list:system.elements, type:'elements', kind:'elements'}));

   // system.on('children.updated', ()=>recursionDriver({id:system.id, name:'children', list:system.children, type:'children', kind:'children'}));
   // system.on('elements.updated', ()=>recursionDriver({id:system.id, name:'elements', list:system.elements, type:'elements', kind:'elements'}));



   // system.on('applications.created', ()=>initializeDirectory({name:'applications', list:system.applications}));
   // system.on('applications.removed', ()=>initializeDirectory({name:'applications', list:system.applications}));

	return {
		subscribe,
		// increment
	};

}











export default {
  getApplicationTree,

}
