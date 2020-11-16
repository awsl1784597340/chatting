import Paper from 'material-ui/Paper';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import React from 'react';

const getCardTitleStyle = () => ({
  display: 'flex',
  alignItems: 'center'
})

export default ({ name }) => (
  <Paper
    style={{ maxWidth: 600, marginBottom: 100, marginTop: 100 }}
    zDepth={5}
  >
    <Card>
      <CardMedia
        overlay={
          <CardTitle
            title={`${name}`}
            style={getCardTitleStyle()}
          />
        }
      />
    </Card>

  </Paper>
)
