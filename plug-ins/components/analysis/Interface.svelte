<script>
  import Entry from './Entry.svelte';
  import classIcons from '/plug-ins/class-icons/index.js';
  import stopWheel from '/plug-ins/stop-wheel/index.js';
  import {getFunctionSignature} from '/plug-ins/code-tools/index.js';

  export let stores;
  export let object;

  export let x;
  export let y;

  export let paneItems;

  let opened = {
    children:true,
    Trait: true,
    Method: true,
  };

</script>

{#if object}

  <div class="container-fluid pt-3" style="overflow-y: scroll;" use:stopWheel>

      <div class="row">
        <div class="col">
        <h3>
          {object.oo.name} Class;
          <small class="text-body-secondary">id:{object.id} <span style="font-size: .92rem;">({$x}x{$y})<span></small>
        </h3>
        </div>
      </div>

      <div class="row">
      <div class="col">


      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          {#each object.oo.extends as item, i}
            <li class="breadcrumb-item"><i class="bi bi-{classIcons(item.name)} text-light pe-2"></i> {item.name}</li>
          {/each}
        </ol>
      </nav>



      {#if object.children}
        {@const feature = 'children'}
          <div class="card mb-3">
            <div class="card-header" on:click={()=>opened[feature]=!opened[feature]}>
            {#if opened[feature]}
            <i class="bi bi-caret-down-fill"></i>
            {:else}
            <i class="bi bi-caret-right"></i>
            {/if}
              Children
            </div>
            {#if opened[feature] && object.children}
              <ul class="list-group list-group-flush">
                {#each object.children.raw as item, i}
                  <li class="list-group-item"><i class="bi bi-{classIcons(item.oo.name)} text-light pe-2"></i>{item.oo.name}</li>
                  {#if item.oo.name == 'Pane'}
                    {#each object.pane.applications.raw as item, i}
                      <li class="list-group-item ps-5"><small><i class="bi bi-{classIcons(item.oo.name)} text-light pe-2"></i>{item.oo.name}</small></li>

                    {/each}
                  {/if}
                {/each}
              </ul>
            {/if}
          </div>
      {/if}


      {#if object}
        {@const feature = 'Trait'}
          <div class="card mb-3">
            <div class="card-header"  on:click={()=>opened[feature]=!opened[feature]}>
            {#if opened[feature]}
            <i class="bi bi-caret-down-fill"></i>
            {:else}
            <i class="bi bi-caret-right"></i>
            {/if}
              Traits
            </div>
            {#if opened[feature]}
              <ul class="list-group list-group-flush">
                {#each object.oo.getTraits() as item, i}
                  <li class="list-group-item" class:opacity-50={item.data.length==0}><i class="bi bi-{classIcons(item.name)} text-light pe-2"></i>{item.name}</li>
                  {#if item.data}
                    {#each item.data as item, i}
                      <li class="list-group-item ps-5"><small><i class="bi bi-{classIcons(feature)} text-light pe-2"></i>{item.name}({getFunctionSignature(item.code).join(', ')})</small></li>

                    {/each}
                  {/if}
                {/each}
              </ul>
            {/if}
          </div>
      {/if}

      {#if object}
        {@const feature = 'Method'}
          <div class="card mb-3">
            <div class="card-header" on:click={()=>opened[feature]=!opened[feature]}>
            {#if opened[feature]}
            <i class="bi bi-caret-down-fill"></i>
            {:else}
            <i class="bi bi-caret-right"></i>
            {/if}
              Methods
            </div>
            {#if opened[feature]}
              <ul class="list-group list-group-flush">
                {#each object.oo.getMethods() as item, i}
                  <li class="list-group-item"><i class="bi bi-{classIcons(item.name)} text-light pe-2"></i>{item.name}</li>
                  {#if item.data}
                    {#each item.data as item, i}
                      <li class="list-group-item ps-5"><small><i class="bi bi-{classIcons(feature)} text-light pe-2"></i>{item.name}</small></li>

                    {/each}
                  {/if}
                {/each}
              </ul>
            {/if}
          </div>
      {/if}









        </div>
        </div>



  </div>
{/if}
