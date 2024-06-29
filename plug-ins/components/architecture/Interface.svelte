<script>
  import Entry from './Entry.svelte';
  import classIcons from '/plug-ins/class-icons/index.js';
  export let send;
  export let tree;
</script>

<div class="container-fluid pt-3">
  <div class="row">
    <div class="col">
      <div class="btn-group btn-group-sm float-end">
      <button type="button" class="btn btn-outline-secondary"> <i class="bi bi-vignette me-2"></i> Squelch </button>
        <button type="button" class="btn btn-outline-secondary" on:click={()=>tree.snapshot()}> <i class="bi bi-camera me-2"></i> Refresh Snapshot </button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
    <ul class="list-unstyled my-3">
      <Entry {send} item={$tree}/>
    </ul>
    </div>
  </div>
</div>

<!-- <pre><small>{JSON.stringify($tree,null,2)}<small></pre> -->
