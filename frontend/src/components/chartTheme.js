import { useEffect, useState } from 'react';

// Shared Recharts styling so every chart uses the same dark theme.

// True on phone-sized screens (same breakpoint as the CSS), so charts can use fewer
// axis labels and a narrower y-axis there.
export const useIsNarrow = (query = '(max-width: 520px)') => {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return narrow;
};
export const CHART_COLORS = {
  teal: '#45D6B0',
  solar: '#F3B75B',
  grid: '#26364A',
  axis: '#94A3B8',
  text: '#E8EEF5',
  surface: '#1B2A3D',
};

export const axisProps = {
  stroke: CHART_COLORS.grid,
  tick: { fill: CHART_COLORS.axis, fontSize: 12 },
  tickLine: false,
};

// Slightly smaller axis labels for phones
export const narrowTick = { tick: { fill: CHART_COLORS.axis, fontSize: 11 } };

export const gridProps = {
  stroke: CHART_COLORS.grid,
  strokeDasharray: '3 6',
  vertical: false,
};

export const tooltipProps = {
  contentStyle: {
    background: CHART_COLORS.surface,
    border: `1px solid ${CHART_COLORS.grid}`,
    borderRadius: 10,
    color: CHART_COLORS.text,
    fontSize: 13,
    boxShadow: 'none',
  },
  labelStyle: { color: CHART_COLORS.axis, marginBottom: 4 },
  itemStyle: { color: CHART_COLORS.text },
  cursor: { stroke: CHART_COLORS.axis, strokeDasharray: '3 3' },
};

// Smaller tooltip box for phones so it covers less of the graph
export const tooltipPropsFor = (narrow) =>
  narrow
    ? {
        ...tooltipProps,
        contentStyle: { ...tooltipProps.contentStyle, fontSize: 12, padding: '6px 10px' },
        labelStyle: { ...tooltipProps.labelStyle, marginBottom: 2 },
        itemStyle: { ...tooltipProps.itemStyle, padding: 0 },
      }
    : tooltipProps;
