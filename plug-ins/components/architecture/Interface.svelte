<script>

  import Entry from './Entry.svelte';
  import classIcons from '/plug-ins/class-icons/index.js';

  export let stores;
  export let send;

  export let paneItems;

  let opened = {Applications:true};
  let active = null;

</script>

<div class="container-fluid pt-3" style="overflow-y: scroll;">

  <!-- {JSON.stringify($paneItems)} -->

    <div class="row">
      <div class="col">

      </div>
    </div>
    <div class="row">
      <div class="col">




        {#each $paneItems as { id, name, label, list }, i}

        <div class="card m-3">
          <div class="card-header" on:click={()=>opened[label]=!opened[label]}>

          {#if opened[label]}
            <i class="bi bi-caret-down-fill"></i>
          {:else}
            <i class="bi bi-caret-right"></i>
          {/if}

          {label}

          {#if opened[label]}
          {:else}
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">{list.length}</span>
          {/if}

          </div>

          {#if opened[label]}
            <ul class="list-unstyled my-3">
              {#each list as { id, name, type }, i}
                <li class="p-3 hoverable-primary" class:bg-secondary={active==id} on:click={()=>{active=id; send('out', {id})}}><i class="bi bi-{classIcons(type)} text-light pe-2" title="{id}"></i> <span class="text-muted">{name} <small class="opacity-50 float-end">{type}</small></span></li>
              {/each}
            </ul>
          {/if}

        </div>


        {/each}








      </div>
    </div>


</div>
