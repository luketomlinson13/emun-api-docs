import { List, ListItem, ListItemText, ListSubheader, Link } from '@mui/material';

const apiLinks = [
  {
    label: 'Sandbox',
    url: 'https://emun1-agency-sandbox.ws.emuncloud.com',
  },
  {
    label: 'Production',
    url: 'https://emun1-agency-api.ws.emuncloud.com',
  },
  {
    label: 'Swagger-UI',
    url: 'https://emunvendors.ws.emuncloud.com/api/agency/index.html',
  },
];

export default function ApiLinks() {
  return (
    <List
      subheader={
        <ListSubheader component='div' sx={{ mt: 2 }}>
          Links
        </ListSubheader>
      }
    >
      {apiLinks.map(({ label, url }) => (
        <ListItem key={label} disablePadding>
          <Link
            href={url}
            target='_blank'
            rel='noopener'
            underline='hover'
            color='primary'
            sx={{
              px: 2,
              py: 0,
              display: 'block',
              width: '100%',
              fontWeight: 300,
            }}
          >
            <ListItemText primary={label} />
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
