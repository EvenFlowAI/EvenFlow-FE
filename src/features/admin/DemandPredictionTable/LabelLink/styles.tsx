import { styled } from '@mui/material';

export const SubLabel = styled('div', {
  shouldForwardProp: prop => prop !== 'color',
})<{ color: string }>(({ theme, color }) => ({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  color,
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}));
