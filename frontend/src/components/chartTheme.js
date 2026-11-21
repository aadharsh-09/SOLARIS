// Shared Recharts styling so every chart uses the same dark theme.
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
