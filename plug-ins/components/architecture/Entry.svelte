<script>
  export let root;
</script>

{#each root.children.raw as { id, name }, i}
  <li>
     {name}
  </li>
{/each}
