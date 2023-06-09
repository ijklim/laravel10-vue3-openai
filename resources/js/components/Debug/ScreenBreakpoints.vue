<script setup>
const breakpoints = [
  'xxl',
  'xl',
  'lg',
  'md',
  'sm',
  'xs',
];

/**
 * A list of classes to hide all breakpoints except the current breakpoint
 *
 * @param {string} classBreakpoint
 */
const classBreakpoint = (currentBreakpoint) => {
  return breakpoints
    .map((breakpoint) => {
      // Note: d-xs-... does not exist, must use d-...
      const prefix = breakpoint === 'xs' ? 'd' : `d-${breakpoint}`;

      return (breakpoint === currentBreakpoint) ? `${prefix}-flex` : `${prefix}-none`;
    })
    .join(' ');
}
</script>

<template>
  <div
    class="pa-3"
    style="position:absolute; top:0px; right:0px; z-index:10000;"
  >
    <vChip
      color="orange"
      text-color="white"
      v-for="breakpoint in breakpoints"
      :class="classBreakpoint(breakpoint)"
      :key="breakpoint"
    >
      {{ breakpoint }}
    </vChip>
  </div>
</template>