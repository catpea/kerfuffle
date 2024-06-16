<script>

  import Entry from './Entry.svelte';
  import classIcons from '/plug-ins/class-icons/index.js';

  export let stores;
  export let object;

  export let paneItems;

  let opened = {extends:true};

</script>

{#if object}
  <div class="container-fluid pt-3" style="overflow-y: scroll;">

      <div class="row">
        <div class="col">
        <h3>
          {object.oo.name} Class
          <small class="text-body-secondary">id:{object.id}</small>
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




            <div class="card mb-3">
              <div class="card-header" on:click={()=>opened.extends=!opened.extends}>
              {#if opened.extends}
              <i class="bi bi-caret-down-fill"></i>
              {:else}
              <i class="bi bi-caret-right"></i>
              {/if}
                Children
              </div>

              {#if opened.extends && object.children}
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










        </div>
        </div>



  </div>
{/if}
