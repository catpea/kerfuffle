<script>

  import Entry from './Entry.svelte';

  export let stores;

  export let paneItems;

  let opened = {Applications:true};

</script>

<div class="container-fluid pt-3" style="overflow-y: scroll;">

  <!-- {JSON.stringify($paneItems)} -->

    <div class="row">
      <div class="col">

      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul>
          <!-- <Entry {root}/> -->
          <!-- {#each $paneItems as { id, name, type }, i}
            {id} {name} ({type})
          {/each} -->
        </ul>



        {#each $paneItems as { id, name, label, list }, i}

        <div class="card mb-3">
          <div class="card-header" on:click={()=>opened[label]=!opened[label]}>
          {#if opened[label]}
          <i class="bi bi-caret-down-fill"></i>
          {:else}
          <i class="bi bi-caret-right"></i>
          {/if}
            {label}
          </div>

          {#if opened[label]}
            <ul class="list-group list-group-flush">
              {#each list as { id, name, type }, i}
                <li class="list-group-item">{id} {name} ({type})</li>
              {/each}
            </ul>
          {/if}

        </div>


        {/each}








      </div>
    </div>


</div>
