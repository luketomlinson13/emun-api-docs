import { Box, Divider, Typography, useTheme } from '@mui/material';
import CopyButton from './CopyButton';

interface Props {
  json: Record<string, any>;
}

export function JsonBlock(props: Props) {
  const theme = useTheme();
  const { json } = props;

  return (
    <Box flex={1}>
      <Box display='flex' flexGrow={1} justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>Example JSON</Typography>
        <CopyButton textToCopy={JSON.stringify(json)} />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box
        component='pre'
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? 'black' : '#f5f5f5',
          color: theme.palette.mode === 'dark' ? 'lime' : '#222',
          padding: '1em',
          borderRadius: '8px',
          overflowX: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {JSON.stringify(json, null, 2)}
      </Box>
    </Box>
  );
}
