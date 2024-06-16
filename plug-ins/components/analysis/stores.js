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











export default {
  getPaneItems,

}
