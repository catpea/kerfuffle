<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  import classIcons from '/plug-ins/class-icons/index.js';
  export let item;
  export let send;
  export let controller;

  let open = item.open;

</script>

<li>

    <div class="hoverable-text-light pb-4 rounded">

      {#if item.children.length}
        {#if open}
          <i class="bi bi-caret-down align-top opacity-50" on:click={()=>open=!open}></i>
        {:else}
          <i class="bi bi-caret-right-fill align-top opacity-50" on:click={()=>open=!open}></i>
        {/if}
      {/if}

      <span class="ps-2 text-muted" on:click={()=>send('out', {object:item.object})}>{item.name}</span>

      <small class="opacity-50 float-end">
      {item.type}
      <i class="bi bi-{classIcons(item.type)} text-light ps-2" title="{item.id}"></i>
      </small>

    </div>



    {#if open}
      <ul class="list-unstyled ps-4" transition:slide={{ delay: 1, duration: 300, easing: quintOut, axis: 'y' }}>
        {#each item.children as item, i}
          <svelte:self {controller} {send} {item}/>
        {/each}
      </ul>
    {/if}

</li>
