import { Box, Typography } from '@mui/material';

export default function DefaultContent() {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      height='60vh'
      textAlign='center'
      color='text.secondary'
    >
      <img src='/emunlogo.svg' alt='API Logo' style={{ width: 220, marginBottom: 24 }} />
      <Typography variant='h4' gutterBottom>
        API Documentation
      </Typography>
      <Typography variant='body1'>Select an endpoint or object from the sidebar to get started.</Typography>
    </Box>
  );
}
