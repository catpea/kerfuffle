<script>

  export let control;

  export let displayTitle = 'Node';
  export let displayStatus = {counter:0, percent:0, length:0};
  export let displaySample = '(none)';

</script>

<div class="card">
  <div class="card-body">

    {#if displayStatus.counter}
    <div class="card-text mb-2">
    Buffer
      <div class="progress" role="progressbar" aria-label="Queue Progress" aria-valuenow="{displayStatus.counter}" aria-valuemin="0" aria-valuemax="{displayStatus.length}">
        <div class="progress-bar" style="width: {displayStatus.percent}%">
           {displayStatus.counter}/{displayStatus.length}
        </div>
      </div>
    </div>
    {/if}

    <small class="card-subtitle mb-2 text-body-secondary text-truncate d-block">{displayTitle}</small>
  </div>
</div>
