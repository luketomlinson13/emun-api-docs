import { Box, List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { generateExampleJson } from '../functions/generateExampleJson';
import { JsonBlock } from './JsonBlock';

const convertPropertiesToFields = (
  properties: Record<string, any>
): {
  name: string;
  type: string;
  description?: string;
  nestedFields?: any[];
}[] => {
  return Object.entries(properties).map(([name, prop]) => {
    const type = prop.type || 'object';
    let nestedFields = undefined;

    if (type === 'object' && prop.properties) {
      nestedFields = convertPropertiesToFields(prop.properties);
    } else if (type === 'array' && prop.items?.properties) {
      nestedFields = convertPropertiesToFields(prop.items.properties);
    }

    return {
      name,
      type,
      description: prop.description,
      nestedFields,
    };
  });
};

export default function DefinitionViewer({
  description,
  schema,
}: {
  description?: string;
  schema: {
    type: string;
    properties: Record<string, any>;
  };
}) {
  const fields = convertPropertiesToFields(schema.properties || {});
  const exampleJson = generateExampleJson(fields);

  return (
    <Box>
      {description && (
        <Typography variant='subtitle1' sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      <Box display='flex' flexDirection={{ xs: 'column', sm: 'row' }} gap={3} width='100%'>
        {/* Left - field descriptions */}
        <Box flex={1}>
          <Typography variant='h6'>Properties</Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {fields.map((field) => (
              <ListItem key={field.name} alignItems='flex-start'>
                <ListItemText
                  primary={
                    <Typography>
                      <code>{field.name}</code>{' '}
                      <Typography variant='caption' component='span' color='textSecondary'>
                        ({field.type})
                      </Typography>
                    </Typography>
                  }
                  secondary={field.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right - Example JSON */}
        <JsonBlock json={exampleJson} />
      </Box>
    </Box>
  );
}
