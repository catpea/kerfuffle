<script>
  export let control;

  export let options = {data:[]};

</script>

<div class="card">
  <div class="card-header">
    Operations
  </div>
  <ul class="list-group list-group-flush">
    {#each options.data as { text, value, action }, i}
      <li class="list-group-item" on:click={action}>{text}</li>
    {/each}
  </ul>
</div>
